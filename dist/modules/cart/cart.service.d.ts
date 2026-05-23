import { Model, Types } from 'mongoose';
import { CartItem } from '../../database/schemas/cart-item.schema';
import { Product } from '../../database/schemas/product.schema';
import { ProductImage } from '../../database/schemas/product-image.schema';
export declare class CartService {
    private cartItemModel;
    private productModel;
    private productImageModel;
    constructor(cartItemModel: Model<CartItem>, productModel: Model<Product>, productImageModel: Model<ProductImage>);
    getCart(userId: string): Promise<{
        items: {
            product: any;
            userId: Types.ObjectId;
            productId: Types.ObjectId;
            quantity: number;
            _id: Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            isNew: boolean;
            schema: import("mongoose").Schema;
            __v: number;
        }[];
        total: number;
        itemCount: number;
    }>;
    addItem(userId: string, productId: string, quantity?: number): Promise<(import("mongoose").Document<unknown, {}, CartItem, {}, import("mongoose").DefaultSchemaOptions> & CartItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | (CartItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })>;
    updateQuantity(userId: string, itemId: string, quantity: number): Promise<CartItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        message: string;
    }>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
}
