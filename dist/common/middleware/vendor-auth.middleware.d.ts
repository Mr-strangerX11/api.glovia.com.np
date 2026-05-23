import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { User } from '../../database/schemas/user.schema';
export declare class VendorAuthMiddleware implements NestMiddleware {
    private userModel;
    constructor(userModel: Model<User>);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare class VendorAuthService {
    private userModel;
    constructor(userModel: Model<User>);
    canCreateProductForVendor(userId: string, targetVendorId: string, userRole: string): Promise<boolean>;
    canViewVendorOrders(userId: string, targetVendorId: string, userRole: string): Promise<boolean>;
    canModifyProduct(userId: string, productVendorId: string, userRole: string): Promise<boolean>;
}
