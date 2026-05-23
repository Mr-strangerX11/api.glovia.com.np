"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let VendorsService = class VendorsService {
    constructor(productModel, orderModel, orderItemModel, userModel) {
        this.productModel = productModel;
        this.orderModel = orderModel;
        this.orderItemModel = orderItemModel;
        this.userModel = userModel;
    }
    async getVendorProducts(vendorId, page = 1, limit = 20, category) {
        try {
            const skip = (page - 1) * limit;
            const query = {
                vendorId: new mongoose_2.Types.ObjectId(vendorId),
                isActive: true,
            };
            if (category) {
                query.categoryId = new mongoose_2.Types.ObjectId(category);
            }
            const products = await this.productModel
                .find(query)
                .populate('categoryId', 'name')
                .populate('brandId', 'name logo')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();
            const total = await this.productModel.countDocuments(query);
            return {
                success: true,
                data: products,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error fetching vendor products: ${error.message}`);
        }
    }
    async getVendorProfile(vendorId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(vendorId)) {
                throw new common_1.NotFoundException('Invalid vendor ID');
            }
            const vendor = await this.userModel.findById(vendorId).select('-password').lean();
            if (!vendor || vendor.role !== 'VENDOR') {
                throw new common_1.NotFoundException('Vendor not found');
            }
            const productCount = await this.productModel.countDocuments({
                vendorId: new mongoose_2.Types.ObjectId(vendorId),
                isActive: true,
            });
            const totalOrders = await this.orderItemModel.countDocuments({
                vendorId: new mongoose_2.Types.ObjectId(vendorId),
            });
            return {
                success: true,
                vendor: {
                    _id: vendor._id,
                    name: vendor.firstName,
                    email: vendor.email,
                    phone: vendor.phone,
                    vendorType: vendor.vendorType,
                    vendorDescription: vendor.vendorDescription,
                    vendorLogo: vendor.vendorLogo,
                    productCount,
                    totalOrders,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Error fetching vendor profile: ${error.message}`);
        }
    }
    async getVendorList(page = 1, limit = 100, search) {
        try {
            const skip = (page - 1) * limit;
            const query = { role: 'VENDOR' };
            if (search) {
                query.$or = [
                    { firstName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                ];
            }
            const vendors = await this.userModel
                .find(query)
                .select('_id firstName email phone vendorType vendorLogo')
                .skip(skip)
                .limit(limit)
                .lean();
            const total = await this.userModel.countDocuments(query);
            return {
                success: true,
                data: vendors,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error fetching vendor list: ${error.message}`);
        }
    }
    async validateVendor(vendorId) {
        const vendor = await this.userModel
            .findOne({
            _id: new mongoose_2.Types.ObjectId(vendorId),
            role: 'VENDOR',
        })
            .lean();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found or invalid vendor ID');
        }
        return vendor;
    }
    async getVendorOrders(vendorId, page = 1, limit = 20, status) {
        try {
            const skip = (page - 1) * limit;
            const vendorObjectId = new mongoose_2.Types.ObjectId(vendorId);
            const query = { 'items.vendorId': vendorObjectId };
            if (status) {
                query.status = status;
            }
            const orders = await this.orderModel
                .find(query)
                .populate('userId', 'firstName lastName email phone')
                .populate('addressId')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();
            const filteredOrders = orders.map((order) => ({
                ...order,
                items: order.items?.filter((item) => item.vendorId?.toString() === vendorId) || [],
                vendorTotal: (order.items || [])
                    .filter((item) => item.vendorId?.toString() === vendorId)
                    .reduce((sum, item) => sum + (item.total || 0), 0),
            }));
            const total = await this.orderModel.countDocuments(query);
            return {
                success: true,
                data: filteredOrders,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error fetching vendor orders: ${error.message}`);
        }
    }
    async authorizeVendor(authenticatedVendorId, targetVendorId) {
        if (authenticatedVendorId !== targetVendorId) {
            throw new common_1.ForbiddenException('You are not authorized to access this vendor data');
        }
    }
};
exports.VendorsService = VendorsService;
exports.VendorsService = VendorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Product')),
    __param(1, (0, mongoose_1.InjectModel)('Order')),
    __param(2, (0, mongoose_1.InjectModel)('OrderItem')),
    __param(3, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], VendorsService);
//# sourceMappingURL=vendors.service.js.map