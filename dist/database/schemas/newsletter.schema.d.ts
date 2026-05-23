import { Document } from 'mongoose';
export declare class NewsletterSubscriber extends Document {
    email: string;
    isActive: boolean;
    source?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const NewsletterSubscriberSchema: import("mongoose").Schema<NewsletterSubscriber, import("mongoose").Model<NewsletterSubscriber, any, any, any, (Document<unknown, any, NewsletterSubscriber, any, import("mongoose").DefaultSchemaOptions> & NewsletterSubscriber & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, NewsletterSubscriber, any, import("mongoose").DefaultSchemaOptions> & NewsletterSubscriber & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, NewsletterSubscriber>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NewsletterSubscriber, Document<unknown, {}, NewsletterSubscriber, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NewsletterSubscriber & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, NewsletterSubscriber, Document<unknown, {}, NewsletterSubscriber, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NewsletterSubscriber & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, NewsletterSubscriber, Document<unknown, {}, NewsletterSubscriber, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NewsletterSubscriber & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date, NewsletterSubscriber, Document<unknown, {}, NewsletterSubscriber, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NewsletterSubscriber & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    email?: import("mongoose").SchemaDefinitionProperty<string, NewsletterSubscriber, Document<unknown, {}, NewsletterSubscriber, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NewsletterSubscriber & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, NewsletterSubscriber, Document<unknown, {}, NewsletterSubscriber, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NewsletterSubscriber & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    source?: import("mongoose").SchemaDefinitionProperty<string, NewsletterSubscriber, Document<unknown, {}, NewsletterSubscriber, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NewsletterSubscriber & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, NewsletterSubscriber>;
