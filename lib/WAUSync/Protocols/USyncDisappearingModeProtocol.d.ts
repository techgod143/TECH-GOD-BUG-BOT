import { USyncQueryProtocol } from '../../Types/USync';
import { BinaryNode } from '../../WABinary';
export type DisappearingModeData = {
    duration: number;
    setAt?: Date;
};
export declare class USyncDisappearingModeProtocol implements USyncQueryProtocol {
    name: string;
    getQueryElement(): BinaryNode;
    getUserElement(): null;
    parser(node: BinaryNode): DisappearingModeData | undefined;
}
