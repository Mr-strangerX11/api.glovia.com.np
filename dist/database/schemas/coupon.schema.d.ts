import { Document } from 'mongoose';
export declare class Coupon extends Document {
    code: string;
    description?: string;
    discountType: string;
    discountValue: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    usageLimit?: number;
    usageCount: number;
    isActive: boolean;
    validFrom: Date;
    validUntil: Date;
}
export declare const CouponSchema: import("mongoose").Schema<Coupon, import("mongoose").Model<Coupon, any, any, any, (Document<unknown, any, Coupon, any, import("mongoose").DefaultSchemaOptions> & Coupon & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Coupon, any, import("mongoose").DefaultSchemaOptions> & Coupon & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, Coupon>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Coupon, Document<unknown, {}, Coupon, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Coupon & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    code?: import("mongoose").SchemaDefinitionProperty<string, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    discountType?: import("mongoose").SchemaDefinitionProperty<string, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    discountValue?: import("mongoose").SchemaDefinitionProperty<number, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    minOrderAmount?: import("mongoose").SchemaDefinitionProperty<number, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    maxDiscount?: import("mongoose").SchemaDefinitionProperty<number, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    usageLimit?: import("mongoose").SchemaDefinitionProperty<number, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    usageCount?: import("mongoose").SchemaDefinitionProperty<number, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    validFrom?: import("mongoose").SchemaDefinitionProperty<Date, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    validUntil?: import("mongoose").SchemaDefinitionProperty<Date, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Coupon>;
