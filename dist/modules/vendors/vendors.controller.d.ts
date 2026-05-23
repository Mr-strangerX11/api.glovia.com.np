import { VendorsService } from './vendors.service';
export declare class VendorsController {
    private vendorsService;
    constructor(vendorsService: VendorsService);
    getVendorList(role: string, page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        data: (import("../../database/schemas").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getVendorOrders(vendorId: string, role: string, page?: number, limit?: number, status?: string): Promise<{
        success: boolean;
        data: any[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getVendorProducts(vendorId: string, page?: number, limit?: number, category?: string): Promise<{
        success: boolean;
        data: (import("../../database/schemas").Product & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getVendorProfile(vendorId: string): Promise<{
        success: boolean;
        vendor: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            phone: string;
            vendorType: import("../../database/schemas").VendorType;
            vendorDescription: string;
            vendorLogo: string;
            productCount: number;
            totalOrders: number;
        };
    }>;
}
