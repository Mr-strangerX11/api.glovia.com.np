import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../../database/schemas/user.schema';
import { Observable } from 'rxjs';
export declare class VendorActiveGuard implements CanActivate {
    private userModel;
    constructor(userModel: Model<User>);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    private validateVendorStatus;
}
