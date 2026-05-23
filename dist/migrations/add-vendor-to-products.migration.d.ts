import { Model } from 'mongoose';
import { Product } from '../database/schemas/product.schema';
import { User } from '../database/schemas/user.schema';
export declare class AddVendorToProductsMigration {
    private productModel;
    private userModel;
    constructor(productModel: Model<Product>, userModel: Model<User>);
    migrate(): Promise<{
        success: number;
        failed: number;
        message: string;
    }>;
    validate(): Promise<{
        valid: number;
        invalid: number;
        details: any[];
    }>;
    rollback(): Promise<{
        rolled_back: number;
        message: string;
    }>;
}
