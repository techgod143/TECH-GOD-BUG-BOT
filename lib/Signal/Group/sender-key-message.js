"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenderKeyMessage = void 0;
const curve_1 = require("libsignal/src/curve");
const WAProto_1 = require("../../../WAProto");
const ciphertext_message_1 = require("./ciphertext-message");
class SenderKeyMessage extends ciphertext_message_1.CiphertextMessage {
    constructor(keyId, iteration, ciphertext, signatureKey, serialized) {
        super();
        this.SIGNATURE_LENGTH = 64;
        if (serialized) {
            const version = serialized[0];
            const message = serialized.slice(1, serialized.length - this.SIGNATURE_LENGTH);
            const signature = serialized.slice(-1 * this.SIGNATURE_LENGTH);
            const senderKeyMessage = WAProto_1.proto.SenderKeyMessage.decode(message).toJSON();
            this.serialized = serialized;
            this.messageVersion = (version & 0xff) >> 4;
            this.keyId = senderKeyMessage.id;
            this.iteration = senderKeyMessage.iteration;
            this.ciphertext =
                typeof senderKeyMessage.ciphertext === 'string'
                    ? Buffer.from(senderKeyMessage.ciphertext, 'base64')
                    : senderKeyMessage.ciphertext;
            this.signature = signature;
        }
        else {
            const version = (((this.CURRENT_VERSION << 4) | this.CURRENT_VERSION) & 0xff) % 256;
            const ciphertextBuffer = Buffer.from(ciphertext);
            const message = WAProto_1.proto.SenderKeyMessage.encode(WAProto_1.proto.SenderKeyMessage.create({
                id: keyId,
                iteration: iteration,
                ciphertext: ciphertextBuffer
            })).finish();
            const signature = this.getSignature(signatureKey, Buffer.concat([Buffer.from([version]), message]));
            this.serialized = Buffer.concat([Buffer.from([version]), message, Buffer.from(signature)]);
            this.messageVersion = this.CURRENT_VERSION;
            this.keyId = keyId;
            this.iteration = iteration;
            this.ciphertext = ciphertextBuffer;
            this.signature = signature;
        }
    }
    getKeyId() {
        return this.keyId;
    }
    getIteration() {
        return this.iteration;
    }
    getCipherText() {
        return this.ciphertext;
    }
    verifySignature(signatureKey) {
        const part1 = this.serialized.slice(0, this.serialized.length - this.SIGNATURE_LENGTH);
        const part2 = this.serialized.slice(-1 * this.SIGNATURE_LENGTH);
        const res = (0, curve_1.verifySignature)(signatureKey, part1, part2);
        if (!res)
            throw new Error('Invalid signature!');
    }
    getSignature(signatureKey, serialized) {
        return Buffer.from((0, curve_1.calculateSignature)(signatureKey, serialized));
    }
    serialize() {
        return this.serialized;
    }
    getType() {
        return 4;
    }
}
exports.SenderKeyMessage = SenderKeyMessage;
