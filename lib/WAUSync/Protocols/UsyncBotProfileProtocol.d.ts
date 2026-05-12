import { USyncQueryProtocol } from '../../Types/USync';
import { BinaryNode } from '../../WABinary';
import { USyncUser } from '../USyncUser';
export type BotProfileCommand = {
    name: string;
    description: string;
};
export type BotProfileInfo = {
    jid: string;
    name: string;
    attributes: string;
    description: string;
    category: string;
    isDefault: boolean;
    prompts: string[];
    personaId: string;
    commands: BotProfileCommand[];
    commandsDescription: string;
};
export declare class USyncBotProfileProtocol implements USyncQueryProtocol {
    name: string;
    getQueryElement(): BinaryNode;
    getUserElement(user: USyncUser): BinaryNode;
    parser(node: BinaryNode): BotProfileInfo;
}
