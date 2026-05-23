import { Document, Types } from 'mongoose';
export declare class FlashDealProduct {
    productId: Types.ObjectId;
    productName: string;
    productImage?: string;
    originalPrice: number;
    salePrice: number;
    discountPercentage?: number;
}
export declare class FlashDeal extends Document {
    title: string;
    description?: string;
    products: FlashDealProduct[];
    startTime: Date;
    endTime: Date;
    isActive: boolean;
    adImage: string;
    displayOrder: number;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    views: number;
    clicks: number;
}
export declare const FlashDealSchema: import("mongoose").Schema<FlashDeal, import("mongoose").Model<FlashDeal, any, any, any, (Document<unknown, any, FlashDeal, any, import("mongoose").DefaultSchemaOptions> & FlashDeal & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, FlashDeal, any, import("mongoose").DefaultSchemaOptions> & FlashDeal & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, FlashDeal>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FlashDeal, Document<unknown, {}, FlashDeal, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, FlashDeal, Document<unknown, {}, FlashDeal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    description?: import("mongoose").SchemaDefinitionProperty<string, FlashDeal, Document<unknown, {}, FlashDeal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, FlashDeal, Document<unknown, {}, FlashDeal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    displayOrder?: import("mongoose").SchemaDefinitionProperty<number, FlashDeal, Document<unknown, {}, FlashDeal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    products?: import("mongoose").SchemaDefinitionProperty<FlashDealProduct[], FlashDeal, Document<unknown, {}, FlashDeal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    title?: import("mongoose").SchemaDefinitionProperty<string, FlashDeal, Document<unknown, {}, FlashDeal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    startTime?: import("mongoose").SchemaDefinitionProperty<Date, FlashDeal, Document<unknown, {}, FlashDeal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    endTime?: import("mongoose").SchemaDefinitionProperty<Date, FlashDeal, Document<unknown, {}, FlashDeal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    adImage?: import("mongoose").SchemaDefinitionProperty<string, FlashDeal, Document<unknown, {}, FlashDeal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, FlashDeal, Document<unknown, {}, FlashDeal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    updatedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, FlashDeal, Document<unknown, {}, FlashDeal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    views?: import("mongoose").SchemaDefinitionProperty<number, FlashDeal, Document<unknown, {}, FlashDeal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    clicks?: import("mongoose").SchemaDefinitionProperty<number, FlashDeal, Document<unknown, {}, FlashDeal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, FlashDeal>;
