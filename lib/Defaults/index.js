var __importDefault = this && this.__importDefault || function (a) {
    return a && a.__esModule ? a : { "default": a }
};

Object.defineProperty(exports, "__esModule", { value: !0 });

exports.DEFAULT_CACHE_TTLS =
    exports.INITIAL_PREKEY_COUNT =
    exports.MIN_PREKEY_COUNT =
    exports.MEDIA_KEYS =
    exports.MEDIA_HKDF_KEY_MAPPING =
    exports.MEDIA_PATH_MAP =
    exports.DEFAULT_CONNECTION_CONFIG =
    exports.PROCESSABLE_HISTORY_TYPES =
    exports.WA_CERT_DETAILS =
    exports.URL_REGEX =
    exports.NOISE_WA_HEADER =
    exports.KEY_BUNDLE_TYPE =
    exports.DICT_VERSION =
    exports.NOISE_MODE =
    exports.WA_DEFAULT_EPHEMERAL =
    exports.PHONE_CONNECTION_CB =
    exports.DEF_TAG_PREFIX =
    exports.DEF_CALLBACK_PREFIX =
    exports.DEFAULT_ORIGIN =
    exports.UNAUTHORIZED_CODES =
    void 0;

const crypto_1 = require("crypto");
const WAProto_1 = require("../../WAProto"),
    libsignal_1 = require("../Signal/libsignal"),
    Utils_1 = require("../Utils"),
    logger_1 = __importDefault(require("../Utils/logger")),
    baileys_version_json_1 = require("./baileys-version.json"),
    phonenumber_mcc_json_1 = __importDefault(require("./phonenumber-mcc.json"));

exports.UNAUTHORIZED_CODES = [401, 403, 419];
exports.version = [2, 3000, 1027934701];
exports.PHONENUMBER_MCC = phonenumber_mcc_json_1.default;
exports.DEFAULT_ORIGIN = "https://web.whatsapp.com";
exports.MOBILE_ENDPOINT = 'g.whatsapp.net';
exports.MOBILE_PORT = 443;
exports.DEF_CALLBACK_PREFIX = "CB:";
exports.DEF_TAG_PREFIX = "TAG:";
exports.PHONE_CONNECTION_CB = "CB:Pong";
exports.WA_DEFAULT_EPHEMERAL = 604800;
const WA_VERSION = '2.25.23.24';
const WA_VERSION_HASH = (0, crypto_1.createHash)('md5').update(WA_VERSION).digest('hex');
exports.MOBILE_TOKEN = Buffer.from('0a1mLfGUIBVrMKF1RdvLI5lkRBvof6vn0fD2QRSM' + WA_VERSION_HASH);
exports.MOBILE_REGISTRATION_ENDPOINT = 'https://v.whatsapp.net/v2';
exports.MOBILE_USERAGENT = `WhatsApp/${WA_VERSION} iOS/17.5.1 Device/Apple-iPhone_13`;
exports.REGISTRATION_PUBLIC_KEY = Buffer.from([
    5, 142, 140, 15, 116, 195, 235, 197, 215, 166, 134, 92, 108, 60, 132, 56, 86, 176, 97, 33, 204, 232, 234, 119, 77,
    34, 251, 111, 18, 37, 18, 48, 45,
]);
exports.NOISE_MODE = "Noise_XX_25519_AESGCM_SHA256\x00\x00\x00\x00";
exports.DICT_VERSION = 2;
exports.KEY_BUNDLE_TYPE = Buffer.from([5]);
exports.NOISE_WA_HEADER = Buffer.from([87, 65, 6, exports.DICT_VERSION]);
exports.PROTOCOL_VERSION = [5, 2];
exports.MOBILE_NOISE_HEADER = Buffer.concat([Buffer.from('WA'), Buffer.from(exports.PROTOCOL_VERSION)]);

exports.URL_REGEX = /https:\/\/(?![^:@\/\s]+:[^:@\/\s]+@)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?/g;
exports.WA_CERT_DETAILS = { SERIAL: 0 };

exports.PROCESSABLE_HISTORY_TYPES = [
    WAProto_1.proto.Message.HistorySyncNotification.HistorySyncType.INITIAL_BOOTSTRAP,
    WAProto_1.proto.Message.HistorySyncNotification.HistorySyncType.PUSH_NAME,
    WAProto_1.proto.Message.HistorySyncNotification.HistorySyncType.RECENT,
    WAProto_1.proto.Message.HistorySyncNotification.HistorySyncType.FULL,
    WAProto_1.proto.Message.HistorySyncNotification.HistorySyncType.ON_DEMAND
];

exports.DEFAULT_CONNECTION_CONFIG = {
    version: baileys_version_json_1.version,
    browser: Utils_1.Browsers("Chrome"),
    waWebSocketUrl: "wss://web.whatsapp.com/ws/chat",
    connectTimeoutMs: 2E4,
    keepAliveIntervalMs: 3E4,
    logger: logger_1.default.child({ class: "baileys" }),
    printQRInTerminal: !1,
    emitOwnEvents: !0,
    defaultQueryTimeoutMs: 6E4,
    customUploadHosts: [],
    retryRequestDelayMs: 250,
    maxMsgRetryCount: 5,
    fireInitQueries: !0,
    auth: void 0,
    markOnlineOnConnect: !0,
    syncFullHistory: !1,
    patchMessageBeforeSending: a => a,
    shouldSyncHistoryMessage: () => !0,
    shouldIgnoreJid: () => !1,
    linkPreviewImageThumbnailWidth: 192,
    transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3E3 },
    generateHighQualityLinkPreview: !1,
    options: {},
    appStateMacVerification: { patch: !1, snapshot: !1 },
    countryCode: "US",
    getMessage: async () => { },
    cachedGroupMetadata: async () => { },
    makeSignalRepository: libsignal_1.makeLibSignalRepository
};

exports.MEDIA_PATH_MAP = {
    image: "/mms/image",
    video: "/mms/video",
    document: "/mms/document",
    audio: "/mms/audio",
    sticker: "/mms/image",
    "thumbnail-link": "/mms/image",
    "product-catalog-image": "/product/image",
    "md-app-state": "",
    "md-msg-hist": "/mms/md-app-state"
};

exports.MEDIA_HKDF_KEY_MAPPING = {
    audio: "Audio",
    document: "Document",
    gif: "Video",
    image: "Image",
    ppic: "",
    product: "Image",
    ptt: "Audio",
    sticker: "Image",
    video: "Video",
    "thumbnail-document": "Document Thumbnail",
    "thumbnail-image": "Image Thumbnail",
    "thumbnail-video": "Video Thumbnail",
    "thumbnail-link": "Link Thumbnail",
    "md-msg-hist": "History",
    "md-app-state": "App State",
    "product-catalog-image": "",
    "payment-bg-image": "Payment Background",
    ptv: "Video"
};

exports.MEDIA_KEYS = Object.keys(exports.MEDIA_PATH_MAP);
exports.MIN_PREKEY_COUNT = 5;
exports.INITIAL_PREKEY_COUNT = 30;

exports.DEFAULT_CACHE_TTLS = {
    SIGNAL_STORE: 300,
    MSG_RETRY: 3600,
    CALL_OFFER: 300,
    USER_DEVICES: 300
};
