// dugong.d.ts
import { proto } from '../../WAProto';

declare namespace kikyy {
    interface MediaUploadOptions {
        fileEncSha256?: Buffer;
        mediaType?: string;
        newsletter?: boolean;
    }

    type WAMediaUploadFunction = (
        stream: Buffer | NodeJS.ReadableStream, 
        options?: MediaUploadOptions
    ) => Promise<{ url: string; directPath: string }>;

    interface WAMessageContentGenerationOptions {
        upload?: WAMediaUploadFunction;
        mediaCache?: any;
        options?: any;
        logger?: any;
    }

    interface StickerMessage {
        url: string;
        fileSha256: Buffer | string;
        fileEncSha256: Buffer | string;
        mediaKey: Buffer | string;
        mimetype: string;
        directPath: string;
        fileLength: number | string;
        mediaKeyTimestamp: number | string;
        isAnimated?: boolean;
        stickerSentTs?: number | string;
        isAvatar?: boolean;
        isAiSticker?: boolean;
        isLottie?: boolean;
    }

    interface PaymentMessage {
        amount: number;
        currency?: string;
        from?: string;
        expiry?: number;
        sticker?: { stickerMessage: StickerMessage };
        note?: string;
        background?: {
            id?: string;
            fileLength?: string;
            width?: number;
            height?: number;
            mimetype?: string;
            placeholderArgb?: number;
            textArgb?: number;
            subtextArgb?: number;
        };
    }

    interface ProductMessage {
        title: string;
        description: string;
        thumbnail: Buffer | { url: string };
        productId: string;
        retailerId: string;
        url: string;
        body?: string;
        footer?: string;
        buttons?: proto.Message.InteractiveMessage.INativeFlowButton[];
        priceAmount1000?: number | null;
        currencyCode?: string;
    }

    interface InteractiveMessage {
        header?: string;
        title: string;
        footer?: string;
        thumbnail?: string;
        image?: string | Buffer | { url: string };
        video?: string | Buffer | { url: string };
        document?: string | Buffer | { url: string };
        mimetype?: string;
        fileName?: string;
        jpegThumbnail?: string | Buffer | { url: string };
        contextInfo?: {
            mentionedJid?: string[];
            forwardingScore?: number;
            isForwarded?: boolean;
            externalAdReply?: {
                title?: string;
                body?: string;
                mediaType?: number;
                thumbnailUrl?: string;
                mediaUrl?: string;
                sourceUrl?: string;
                showAdAttribution?: boolean;
                renderLargerThumbnail?: boolean;
                [key: string]: any;
            };
            [key: string]: any;
        };
        externalAdReply?: {
            title?: string;
            body?: string;
            mediaType?: number;
            thumbnailUrl?: string;
            mediaUrl?: string;
            sourceUrl?: string;
            showAdAttribution?: boolean;
            renderLargerThumbnail?: boolean;
            [key: string]: any;
        };
        buttons?: proto.Message.InteractiveMessage.INativeFlowButton[];
        nativeFlowMessage?: {
            messageParamsJson?: string;
            buttons?: proto.Message.InteractiveMessage.INativeFlowButton[];
            [key: string]: any;
        };
    }

    interface AlbumItem {
        image?: string | Buffer | { url: string; caption?: string };
        video?: string | Buffer | { url: string; caption?: string };
    }

    interface EventMessageLocation {
        degreesLatitude: number;
        degreesLongitude: number;
        name: string;
    }

    interface EventMessage {
        isCanceled?: boolean;
        name: string;
        description: string;
        location?: EventMessageLocation;
        joinLink?: string;
        startTime?: string | number;
        endTime?: string | number;
        extraGuestsAllowed?: boolean;
    }
    
    interface PollVote {
        optionName: string;
        optionVoteCount: string | number;
    }
    
    interface PollResultMessage {
        name: string;
        pollVotes: PollVote[];
    }

    interface GroupStatusMessage {
        message?: any;
        image?: string | Buffer | { url: string };
        video?: string | Buffer | { url: string };
        text?: string;
        caption?: string;
        document?: string | Buffer | { url: string };
        [key: string]: any;
    }
 
    interface MessageContent {
        requestPaymentMessage?: PaymentMessage;
        productMessage?: ProductMessage;
        interactiveMessage?: InteractiveMessage;
        albumMessage?: AlbumItem[];
        eventMessage?: EventMessage;
        pollResultMessage?: PollResultMessage;
        groupStatusMessage?: GroupStatusMessage;
        sender?: string;
    }

    interface MessageOptions {
        quoted?: proto.IWebMessageInfo;
        filter?: boolean;
    }

    interface Utils {
        prepareWAMessageMedia: (media: any, options: WAMessageContentGenerationOptions) => Promise<any>;
        generateWAMessageContent: (content: any, options: WAMessageContentGenerationOptions) => Promise<any>;
        generateWAMessageFromContent: (jid: string, content: any, options?: any) => Promise<any>;
        generateWAMessage: (jid: string, content: any, options?: any) => Promise<any>;
        generateMessageID: () => string;
        prepareMessageContent?: (content: any, options?: any) => Promise<any>;
    }

    interface BailUtils {
        generateWAMessageContent?: (content: any, options: WAMessageContentGenerationOptions) => Promise<any>;
        generateMessageID: () => string;
        getContentType: (msg: any) => string;
    }
}

declare class kikyy {
    constructor(
        utils: kikyy.Utils,
        waUploadToServer: kikyy.WAMediaUploadFunction,
        relayMessageFn?: (jid: string, content: any, options?: any) => Promise<any>
    );
    
    detectType(content: kikyy.MessageContent): 'PAYMENT' | 'PRODUCT' | 'INTERACTIVE' | 'ALBUM' | 'EVENT' | 'POLL_RESULT' | 'GROUP_STORY' | null;

    handlePayment(
        content: { requestPaymentMessage: kikyy.PaymentMessage },
        quoted?: proto.IWebMessageInfo
    ): Promise<{ requestPaymentMessage: proto.Message.RequestPaymentMessage }>;

    handleProduct(
        content: { productMessage: kikyy.ProductMessage },
        jid: string,
        quoted?: proto.IWebMessageInfo
    ): Promise<{ viewOnceMessage: proto.Message.ViewOnceMessage }>;

    handleInteractive(
        content: { interactiveMessage: kikyy.InteractiveMessage },
        jid: string,
        quoted?: proto.IWebMessageInfo
    ): Promise<{ interactiveMessage: proto.Message.InteractiveMessage }>;

    handleAlbum(
        content: { albumMessage: kikyy.AlbumItem[] },
        jid: string,
        quoted?: proto.IWebMessageInfo
    ): Promise<any>;

    handleEvent(
        content: { eventMessage: kikyy.EventMessage },
        jid: string,
        quoted?: proto.IWebMessageInfo
    ): Promise<any>;
    
    handlePollResult(
        content: { pollResultMessage: kikyy.PollResultMessage },
        jid: string,
        quoted?: proto.IWebMessageInfo
    ): Promise<any>;

    handleGroupStory(
        content: { groupStatusMessage: kikyy.GroupStatusMessage },
        jid: string,
        quoted?: proto.IWebMessageInfo
    ): Promise<any>;

    buildMessageContent(
        content: any,
        opts?: kikyy.WAMessageContentGenerationOptions
    ): Promise<any>;

    utils: kikyy.Utils;
    relayMessage: (jid: string, content: any, options?: any) => Promise<any>;
    waUploadToServer: kikyy.WAMediaUploadFunction;
    bail: kikyy.BailUtils;
}

export = kikyy;
