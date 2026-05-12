import { USyncQueryProtocol } from '../../Types/USync';
import { BinaryNode } from '../../WABinary';
export type StatusData = {
    status?: string | null;
    setAt?: Date;
};
export declare class USyncStatusProtocol implements USyncQueryProtocol {
    name: string;
    getQueryElement(): BinaryNode;
    getUserElement(): null;
    parser(node: BinaryNode): StatusData | undefined;
}
