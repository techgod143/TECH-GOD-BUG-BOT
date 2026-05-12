"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSignedDeviceIdentity = exports.configureSuccessfulPairing = exports.generateRegistrationNode = exports.generateLoginNode = void 0;
const boom_1 = require("@hapi/boom");
const crypto_1 = require("crypto");
const WAProto_1 = require("../../WAProto");
const Defaults_1 = require("../Defaults");
const WABinary_1 = require("../WABinary");
const crypto_2 = require("./crypto");
const generics_1 = require("./generics");
const signal_1 = require("./signal");

const getUserAgent = (config) => {
    return {
        appVersion: {
            primary: config.version[0],
            secondary: config.version[1],
            tertiary: config.version[2],
        },
        platform: WAProto_1.proto.ClientPayload.UserAgent.Platform.WEB,
        releaseChannel: WAProto_1.proto.ClientPayload.UserAgent.ReleaseChannel.RELEASE,
        osVersion: '0.1',
        device: 'Desktop',
        osBuildNumber: '0.1',
        localeLanguageIso6391: 'en',
        mnc: '000',
        mcc: '000',
        localeCountryIso31661Alpha2: config.countryCode || 'US'
    };
};

const PLATFORM_MAP = {
    'Mac OS': WAProto_1.proto.ClientPayload.WebInfo.WebSubPlatform.DARWIN,
    'Windows': WAProto_1.proto.ClientPayload.WebInfo.WebSubPlatform.WIN32
};

const getWebInfo = (config) => {
    let webSubPlatform = WAProto_1.proto.ClientPayload.WebInfo.WebSubPlatform.WEB_BROWSER;
    if (config.syncFullHistory && PLATFORM_MAP[config.browser[0]] && config.browser[1] === 'Desktop') {
        webSubPlatform = PLATFORM_MAP[config.browser[0]];
    }
    return { webSubPlatform };
};

const getClientPayload = (config) => {
    const payload = {
        connectType: WAProto_1.proto.ClientPayload.ConnectType.WIFI_UNKNOWN,
        connectReason: WAProto_1.proto.ClientPayload.ConnectReason.USER_ACTIVATED,
        userAgent: getUserAgent(config),
    };
    payload.webInfo = getWebInfo(config);
    return payload;
};

const generateLoginNode = (userJid, config) => {
    const { user, device } = (0, WABinary_1.jidDecode)(userJid);
    const payload = {
        ...getClientPayload(config),
        passive: true,
        pull: true,
        username: +user,
        device: device,
        lidDbMigrated: false
    };
    return WAProto_1.proto.ClientPayload.fromObject(payload);
};
exports.generateLoginNode = generateLoginNode;

const getPlatformType = (platform) => {
    const platformType = platform.toUpperCase();
    return WAProto_1.proto.DeviceProps.PlatformType[platformType] || WAProto_1.proto.DeviceProps.PlatformType.CHROME;
};

const generateRegistrationNode = ({ registrationId, signedPreKey, signedIdentityKey }, config) => {
    const appVersionBuf = (0, crypto_1.createHash)('md5')
        .update(config.version.join('.'))
        .digest();

    const companion = {
        os: config.browser[0],
        platformType: getPlatformType(config.browser[1]),
        requireFullSync: config.syncFullHistory,
        historySyncConfig: {
            storageQuotaMb: 10240,
            inlineInitialPayloadInE2EeMsg: true,
            recentSyncDaysLimit: undefined,
            supportCallLogHistory: false,
            supportBotUserAgentChatHistory: true,
            supportCagReactionsAndPolls: true,
            supportBizHostedMsg: true,
            supportRecentSyncChunkMessageCountTuning: true,
            supportHostedGroupMsg: true,
            supportFbidBotChatHistory: true,
            supportAddOnHistorySyncMigration: undefined,
            supportMessageAssociation: true,
            supportGroupHistory: false,
            onDemandReady: undefined,
            supportGuestChat: undefined
        },
        version: {
            primary: 10,
            secondary: 15,
            tertiary: 7
        }
    };

    const companionProto = WAProto_1.proto.DeviceProps.encode(companion).finish();

    const registerPayload = {
        ...getClientPayload(config),
        passive: false,
        pull: false,
        devicePairingData: {
            buildHash: appVersionBuf,
            deviceProps: companionProto,
            eRegid: (0, generics_1.encodeBigEndian)(registrationId),
            eKeytype: Defaults_1.KEY_BUNDLE_TYPE,
            eIdent: signedIdentityKey.public,
            eSkeyId: (0, generics_1.encodeBigEndian)(signedPreKey.keyId, 3),
            eSkeyVal: signedPreKey.keyPair.public,
            eSkeySig: signedPreKey.signature,
        },
    };
    return WAProto_1.proto.ClientPayload.fromObject(registerPayload);
};
exports.generateRegistrationNode = generateRegistrationNode;

const configureSuccessfulPairing = (stanza, { advSecretKey, signedIdentityKey, signalIdentities }) => {
    const msgId = stanza.attrs.id;
    const pairSuccessNode = (0, WABinary_1.getBinaryNodeChild)(stanza, 'pair-success');
    const deviceIdentityNode = (0, WABinary_1.getBinaryNodeChild)(pairSuccessNode, 'device-identity');
    const platformNode = (0, WABinary_1.getBinaryNodeChild)(pairSuccessNode, 'platform');
    const deviceNode = (0, WABinary_1.getBinaryNodeChild)(pairSuccessNode, 'device');
    const businessNode = (0, WABinary_1.getBinaryNodeChild)(pairSuccessNode, 'biz');

    if (!deviceIdentityNode || !deviceNode) {
        throw new boom_1.Boom('Missing device-identity or device in pair success node', { data: stanza });
    }

    const bizName = businessNode?.attrs.name;
    const jid = deviceNode.attrs.jid;
    const lid = deviceNode.attrs.lid;

    const { details, hmac, accountType } = WAProto_1.proto.ADVSignedDeviceIdentityHMAC.decode(deviceIdentityNode.content);

    let hmacPrefix = Buffer.from([]);
    if (accountType !== undefined && accountType === WAProto_1.proto.ADVEncryptionType.HOSTED) {
        hmacPrefix = Buffer.from([0x06, 0x05]);
    }

    const advSign = (0, crypto_2.hmacSign)(Buffer.concat([hmacPrefix, details]), Buffer.from(advSecretKey, 'base64'));
    if (Buffer.compare(hmac, advSign) !== 0) {
        throw new boom_1.Boom('Invalid account signature');
    }

    const account = WAProto_1.proto.ADVSignedDeviceIdentity.decode(details);
    const { accountSignatureKey, accountSignature, details: deviceDetails } = account;

    const deviceIdentity = WAProto_1.proto.ADVDeviceIdentity.decode(deviceDetails);

    const accountSignaturePrefix = deviceIdentity.deviceType === WAProto_1.proto.ADVEncryptionType.HOSTED 
        ? Buffer.from([0x06, 0x05])
        : Buffer.from([0x06, 0x00]);
    const accountMsg = Buffer.concat([accountSignaturePrefix, deviceDetails, signedIdentityKey.public]);
    
    if (!crypto_2.Curve.verify(accountSignatureKey, accountMsg, accountSignature)) {
        throw new boom_1.Boom('Failed to verify account signature');
    }

    const deviceMsg = Buffer.concat([
        Buffer.from([0x06, 0x01]),
        deviceDetails,
        signedIdentityKey.public,
        accountSignatureKey
    ]);
    account.deviceSignature = crypto_2.Curve.sign(signedIdentityKey.private, deviceMsg);

    const identity = (0, signal_1.createSignalIdentity)(jid, accountSignatureKey);
    const accountEnc = (0, exports.encodeSignedDeviceIdentity)(account, false);

    const reply = {
        tag: 'iq',
        attrs: {
            to: WABinary_1.S_WHATSAPP_NET,
            type: 'result',
            id: msgId,
        },
        content: [
            {
                tag: 'pair-device-sign',
                attrs: {},
                content: [
                    {
                        tag: 'device-identity',
                        attrs: { 'key-index': deviceIdentity.keyIndex.toString() },
                        content: accountEnc
                    }
                ]
            }
        ]
    };

    const authUpdate = {
        account,
        me: { id: jid, name: bizName, lid },
        signalIdentities: [
            ...(signalIdentities || []),
            identity
        ],
        platform: platformNode?.attrs.name
    };

    return {
        creds: authUpdate,
        reply
    };
};
exports.configureSuccessfulPairing = configureSuccessfulPairing;

const encodeSignedDeviceIdentity = (account, includeSignatureKey) => {
    account = { ...account };
    if (!includeSignatureKey || !account.accountSignatureKey?.length) {
        account.accountSignatureKey = null;
    }
    return WAProto_1.proto.ADVSignedDeviceIdentity
        .encode(account)
        .finish();
};
exports.encodeSignedDeviceIdentity = encodeSignedDeviceIdentity;
