import { Model, Types } from 'mongoose';
import { Product } from '../../database/schemas/product.schema';
import { Order } from '../../database/schemas/order.schema';
import { OrderItem } from '../../database/schemas/order-item.schema';
import { User } from '../../database/schemas/user.schema';
export declare class VendorsService {
    private productModel;
    private orderModel;
    private orderItemModel;
    private userModel;
    constructor(productModel: Model<Product>, orderModel: Model<Order>, orderItemModel: Model<OrderItem>, userModel: Model<User>);
    getVendorProducts(vendorId: string, page?: number, limit?: number, category?: string): Promise<{
        success: boolean;
        data: (Product & Required<{
            _id: Types.ObjectId;
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
            _id: Types.ObjectId;
            name: string;
            email: string;
            phone: string;
            vendorType: import("../../database/schemas/user.schema").VendorType;
            vendorDescription: string;
            vendorLogo: string;
            productCount: number;
            totalOrders: number;
        };
    }>;
    getVendorList(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        data: (User & Required<{
            _id: Types.ObjectId;
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
    validateVendor(vendorId: string): Promise<User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getVendorOrders(vendorId: string, page?: number, limit?: number, status?: string): Promise<{
        success: boolean;
        data: any[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    authorizeVendor(authenticatedVendorId: string, targetVendorId: string): Promise<void>;
}
