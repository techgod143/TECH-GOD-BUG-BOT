import { USyncQueryProtocol } from '../../Types/USync';
import { BinaryNode } from '../../WABinary';
export declare class USyncLIDProtocol implements USyncQueryProtocol {
    name: string;
    getQueryElement(): BinaryNode;
    getUserElement(): null;
    parser(node: BinaryNode): string | null;
}
