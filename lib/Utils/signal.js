"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextPreKeysNode = exports.getNextPreKeys = exports.extractDeviceJids = exports.parseAndInjectE2ESessions = exports.xmppPreKey = exports.xmppSignedPreKey = exports.generateOrGetPreKeys = exports.getPreKeys = exports.createSignalIdentity = void 0;
const Defaults_1 = require("../Defaults");
const WABinary_1 = require("../WABinary");
const crypto_1 = require("./crypto");
const lodash_1 = require("lodash")
const generics_1 = require("./generics");
const createSignalIdentity = (wid, accountSignatureKey) => {
    return {
        identifier: { name: wid, deviceId: 0 },
        identifierKey: (0, crypto_1.generateSignalPubKey)(accountSignatureKey)
    };
};
exports.createSignalIdentity = createSignalIdentity;
const getPreKeys = async ({ get }, min, limit) => {
    const idList = [];
    for (let id = min; id < limit; id++) {
        idList.push(id.toString());
    }
    return get('pre-key', idList);
};
exports.getPreKeys = getPreKeys;
const generateOrGetPreKeys = (creds, range) => {
    const avaliable = creds.nextPreKeyId - creds.firstUnuploadedPreKeyId;
    const remaining = range - avaliable;
    const lastPreKeyId = creds.nextPreKeyId + remaining - 1;
    const newPreKeys = {};
    if (remaining > 0) {
        for (let i = creds.nextPreKeyId; i <= lastPreKeyId; i++) {
            newPreKeys[i] = crypto_1.Curve.generateKeyPair();
        }
    }
    return {
        newPreKeys,
        lastPreKeyId,
        preKeysRange: [creds.firstUnuploadedPreKeyId, range],
    };
};
exports.generateOrGetPreKeys = generateOrGetPreKeys;
const xmppSignedPreKey = (key) => ({
    tag: 'skey',
    attrs: {},
    content: [
        { tag: 'id', attrs: {}, content: (0, generics_1.encodeBigEndian)(key.keyId, 3) },
        { tag: 'value', attrs: {}, content: key.keyPair.public },
        { tag: 'signature', attrs: {}, content: key.signature }
    ]
});
exports.xmppSignedPreKey = xmppSignedPreKey;
const xmppPreKey = (pair, id) => ({
    tag: 'key',
    attrs: {},
    content: [
        { tag: 'id', attrs: {}, content: (0, generics_1.encodeBigEndian)(id, 3) },
        { tag: 'value', attrs: {}, content: pair.public }
    ]
});
exports.xmppPreKey = xmppPreKey;
const parseAndInjectE2ESessions = async (node, repository) => {
    const extractKey = (key) => (key ? ({
        keyId: WABinary_1.getBinaryNodeChildUInt(key, 'id', 3),
        publicKey: crypto_1.generateSignalPubKey(WABinary_1.getBinaryNodeChildBuffer(key, 'value')),
        signature: WABinary_1.getBinaryNodeChildBuffer(key, 'signature')
    }) : undefined)
    const nodes = WABinary_1.getBinaryNodeChildren(WABinary_1.getBinaryNodeChild(node, 'list'), 'user')
    for (const node of nodes) {
        WABinary_1.assertNodeErrorFree(node)
    }
    // Most of the work in repository.injectE2ESession is CPU intensive, not IO
    // So Promise.all doesn't really help here,
    // but blocks even loop if we're using it inside keys.transaction, and it makes it "sync" actually
    // This way we chunk it in smaller parts and between those parts we can yield to the event loop
    // It's rare case when you need to E2E sessions for so many users, but it's possible
    const chunkSize = 100
    const chunks = lodash_1.chunk(nodes, chunkSize)
    for (const nodesChunk of chunks) {
        await Promise.all(nodesChunk.map(async (node) => {
            const signedKey = WABinary_1.getBinaryNodeChild(node, 'skey')
            const key = WABinary_1.getBinaryNodeChild(node, 'key')
            const identity = WABinary_1.getBinaryNodeChildBuffer(node, 'identity')
            const jid = node.attrs.jid
            const registrationId = WABinary_1.getBinaryNodeChildUInt(node, 'registration', 4)
            await repository.injectE2ESession({
                jid,
                session: {
                    registrationId: registrationId,
                    identityKey: crypto_1.generateSignalPubKey(identity),
                    signedPreKey: extractKey(signedKey),
                    preKey: extractKey(key)
                }
            })
        }))
    }
}
exports.parseAndInjectE2ESessions = parseAndInjectE2ESessions;
const extractDeviceJids = (result, myJid, excludeZeroDevices) => {
    const { user: myUser, device: myDevice } = WABinary_1.jidDecode(myJid)
    const extracted = []
    for (const userResult of result) {
        const { devices, id } = userResult
        const { user } = WABinary_1.jidDecode(id)
        const deviceList = devices?.deviceList
        if (Array.isArray(deviceList)) {
            for (const { id: device, keyIndex } of deviceList) {
                if ((!excludeZeroDevices || device !== 0) && // if zero devices are not-excluded, or device is non zero
                    (myUser !== user || myDevice !== device) && // either different user or if me user, not this device
                    (device === 0 || !!keyIndex) // ensure that "key-index" is specified for "non-zero" devices, produces a bad req otherwise
                ) {
                    extracted.push({ user, device })
                }
            }
        }
    }
    return extracted
}
exports.extractDeviceJids = extractDeviceJids;
/**
 * get the next N keys for upload or processing
 * @param count number of pre-keys to get or generate
 */
const getNextPreKeys = async ({ creds, keys }, count) => {
    const { newPreKeys, lastPreKeyId, preKeysRange } = (0, exports.generateOrGetPreKeys)(creds, count);
    const update = {
        nextPreKeyId: Math.max(lastPreKeyId + 1, creds.nextPreKeyId),
        firstUnuploadedPreKeyId: Math.max(creds.firstUnuploadedPreKeyId, lastPreKeyId + 1)
    };
    await keys.set({ 'pre-key': newPreKeys });
    const preKeys = await (0, exports.getPreKeys)(keys, preKeysRange[0], preKeysRange[0] + preKeysRange[1]);
    return { update, preKeys };
};
exports.getNextPreKeys = getNextPreKeys;
const getNextPreKeysNode = async (state, count) => {
    const { creds } = state;
    const { update, preKeys } = await (0, exports.getNextPreKeys)(state, count);
    const node = {
        tag: 'iq',
        attrs: {
            xmlns: 'encrypt',
            type: 'set',
            to: WABinary_1.S_WHATSAPP_NET,
        },
        content: [
            { tag: 'registration', attrs: {}, content: (0, generics_1.encodeBigEndian)(creds.registrationId) },
            { tag: 'type', attrs: {}, content: Defaults_1.KEY_BUNDLE_TYPE },
            { tag: 'identity', attrs: {}, content: creds.signedIdentityKey.public },
            { tag: 'list', attrs: {}, content: Object.keys(preKeys).map(k => (0, exports.xmppPreKey)(preKeys[+k], +k)) },
            (0, exports.xmppSignedPreKey)(creds.signedPreKey)
        ]
    };
    return { update, node };
};
exports.getNextPreKeysNode = getNextPreKeysNode;
