/// <reference types="node" />
export declare class BinaryInfo {
    protocolVersion: number;
    sequence: number;
    events: {
        [x: string]: {
            props: {
                [x: string]: any;
            };
            globals: {
                [x: string]: any;
            };
        };
    }[];
    buffer: Buffer[];
    constructor(options?: Partial<BinaryInfo>);
}
