import { SenderMessageKey } from './sender-message-key';
export declare class SenderChainKey {
    private readonly MESSAGE_KEY_SEED;
    private readonly CHAIN_KEY_SEED;
    private readonly iteration;
    private readonly chainKey;
    constructor(iteration: number, chainKey: any);
    getIteration(): number;
    getSenderMessageKey(): SenderMessageKey;
    getNext(): SenderChainKey;
    getSeed(): Uint8Array;
    private getDerivative;
}
