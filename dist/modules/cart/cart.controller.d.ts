import { CartService } from './cart.service';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart(userId: string): Promise<{
        items: {
            product: any;
            userId: import("mongoose").Types.ObjectId;
            productId: import("mongoose").Types.ObjectId;
            quantity: number;
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
        }[];
        total: number;
        itemCount: number;
    }>;
    addItem(userId: string, data: {
        productId: string;
        quantity?: number;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../../database/schemas").CartItem, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas").CartItem & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | (import("../../database/schemas").CartItem & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })>;
    updateQuantity(userId: string, itemId: string, data: {
        quantity: number;
    }): Promise<import("../../database/schemas").CartItem & Required<{
        _id: import("mongoose").Types.ObjectId;
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
