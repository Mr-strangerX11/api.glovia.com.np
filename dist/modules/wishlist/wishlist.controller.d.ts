import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(userId: string): Promise<{
        product: any;
        userId: import("mongoose").Types.ObjectId;
        productId: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
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
    addItem(userId: string, data: {
        productId: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../../database/schemas").WishlistItem, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas").WishlistItem & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | (import("../../database/schemas").WishlistItem & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })>;
    removeItem(userId: string, itemId: string): Promise<{
        message: string;
    }>;
}
