import { Model, Types } from 'mongoose';
import { WishlistItem } from '../../database/schemas/wishlist-item.schema';
import { Product } from '../../database/schemas/product.schema';
import { ProductImage } from '../../database/schemas/product-image.schema';
export declare class WishlistService {
    private wishlistModel;
    private productModel;
    private productImageModel;
    constructor(wishlistModel: Model<WishlistItem>, productModel: Model<Product>, productImageModel: Model<ProductImage>);
    getWishlist(userId: string): Promise<{
        product: any;
        userId: Types.ObjectId;
        productId: Types.ObjectId;
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
    }[]>;
    addToWishlist(userId: string, productId: string): Promise<(import("mongoose").Document<unknown, {}, WishlistItem, {}, import("mongoose").DefaultSchemaOptions> & WishlistItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | (WishlistItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })>;
    removeFromWishlist(userId: string, itemId: string): Promise<{
        message: string;
    }>;
}
