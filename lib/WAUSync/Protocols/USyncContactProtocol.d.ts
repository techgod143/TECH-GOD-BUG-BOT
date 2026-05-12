import { USyncQueryProtocol } from '../../Types/USync';
import { BinaryNode } from '../../WABinary';
import { USyncUser } from '../USyncUser';
export declare class USyncContactProtocol implements USyncQueryProtocol {
    name: string;
    getQueryElement(): BinaryNode;
    getUserElement(user: USyncUser): BinaryNode;
    parser(node: BinaryNode): boolean;
}
