import { Document, Types } from 'mongoose';
export declare class OrderItem extends Document {
    orderId: Types.ObjectId;
    productId: Types.ObjectId;
    vendorId: Types.ObjectId;
    vendorName: string;
    vendorEmail: string;
    vendorPhone?: string;
    productName: string;
    productSku?: string;
    quantity: number;
    price: number;
    total: number;
}
export declare const OrderItemSchema: import("mongoose").Schema<OrderItem, import("mongoose").Model<OrderItem, any, any, any, (Document<unknown, any, OrderItem, any, import("mongoose").DefaultSchemaOptions> & OrderItem & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, OrderItem, any, import("mongoose").DefaultSchemaOptions> & OrderItem & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, OrderItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrderItem, Document<unknown, {}, OrderItem, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrderItem & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OrderItem, Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrderItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    price?: import("mongoose").SchemaDefinitionProperty<number, OrderItem, Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrderItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    vendorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OrderItem, Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrderItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    vendorName?: import("mongoose").SchemaDefinitionProperty<string, OrderItem, Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrderItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    vendorEmail?: import("mongoose").SchemaDefinitionProperty<string, OrderItem, Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrderItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    vendorPhone?: import("mongoose").SchemaDefinitionProperty<string, OrderItem, Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrderItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OrderItem, Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrderItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, OrderItem, Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrderItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    total?: import("mongoose").SchemaDefinitionProperty<number, OrderItem, Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrderItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    orderId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OrderItem, Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrderItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    productName?: import("mongoose").SchemaDefinitionProperty<string, OrderItem, Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrderItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    productSku?: import("mongoose").SchemaDefinitionProperty<string, OrderItem, Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrderItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, OrderItem>;
