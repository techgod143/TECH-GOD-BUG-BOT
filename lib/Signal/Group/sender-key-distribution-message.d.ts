import { CiphertextMessage } from './ciphertext-message';
export declare class SenderKeyDistributionMessage extends CiphertextMessage {
    private readonly id;
    private readonly iteration;
    private readonly chainKey;
    private readonly signatureKey;
    private readonly serialized;
    constructor(id?: number | null, iteration?: number | null, chainKey?: Uint8Array | null, signatureKey?: Uint8Array | null, serialized?: Uint8Array | null);
    private intsToByteHighAndLow;
    serialize(): Uint8Array;
    getType(): number;
    getIteration(): number;
    getChainKey(): Uint8Array;
    getSignatureKey(): Uint8Array;
    getId(): number;
}
