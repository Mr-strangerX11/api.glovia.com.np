import { UserRole, VendorType } from '../../../database/schemas/user.schema';
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
    vendorType?: VendorType;
}
export declare class FreezeVendorDto {
    reason?: string;
}
export declare class UnfreezeVendorDto {
    reason?: string;
}
export declare class UpdateUserRoleDto {
    role: UserRole;
}
