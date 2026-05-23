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
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const realtime_service_1 = require("../realtime/realtime.service");
let BrandsService = class BrandsService {
    constructor(brandModel, productModel, productImageModel, orderItemModel, realtimeService) {
        this.brandModel = brandModel;
        this.productModel = productModel;
        this.productImageModel = productImageModel;
        this.orderItemModel = orderItemModel;
        this.realtimeService = realtimeService;
    }
    async getAllBrands(includeProducts = false) {
        const brands = await this.brandModel.find({ isActive: true }).sort({ name: 1 }).lean();
        if (!includeProducts) {
            return brands;
        }
        const brandIds = brands.map((brand) => brand._id);
        const productIdsByBrand = await this.productModel.aggregate([
            { $match: { brandId: { $in: brandIds } } },
            {
                $group: {
                    _id: '$brandId',
                    products: { $push: '$_id' },
                },
            },
        ]);
        const productsByBrandId = productIdsByBrand.reduce((acc, item) => {
            acc[item._id.toString()] = item.products.map((id) => ({ id }));
            return acc;
        }, {});
        return brands.map((brand) => ({
            ...brand,
            products: productsByBrandId[brand._id.toString()] || [],
        }));
    }
    async getBrandBySlug(slug) {
        const brand = await this.brandModel.findOne({ slug }).lean();
        if (!brand) {
            return null;
        }
        const products = await this.productModel
            .find({ brandId: new mongoose_2.Types.ObjectId(brand._id), isActive: true })
            .select('name slug description price stockQuantity categoryId brandId createdAt')
            .lean();
        const productIds = products.map((product) => product._id);
        const images = await this.productImageModel
            .find({ productId: { $in: productIds } })
            .sort({ displayOrder: 1 })
            .lean();
        const imagesByProductId = images.reduce((acc, image) => {
            const key = image.productId.toString();
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(image);
            return acc;
        }, {});
        const productsWithImages = products.map((product) => ({
            ...product,
            images: imagesByProductId[product._id.toString()] || [],
            brand,
        }));
        return {
            ...brand,
            products: productsWithImages,
        };
    }
    async getBrandById(id) {
        const brand = await this.brandModel.findById(id).lean();
        if (!brand) {
            return null;
        }
        const [productCount, products] = await Promise.all([
            this.productModel.countDocuments({ brandId: new mongoose_2.Types.ObjectId(id) }),
            this.productModel
                .find({ brandId: new mongoose_2.Types.ObjectId(id) })
                .select('_id')
                .limit(5)
                .lean(),
        ]);
        return {
            ...brand,
            _count: { products: productCount },
            products: products.map((product) => ({ id: product._id })),
        };
    }
    async createBrand(dto) {
        const slug = dto.slug || dto.name.toLowerCase().replace(/\s+/g, '-');
        const brand = await this.brandModel.create({
            name: dto.name,
            slug,
            description: dto.description,
            logo: dto.logo,
            isActive: true,
        });
        this.realtimeService.emitBrandCreated({
            id: brand._id,
            ...brand.toObject(),
        });
        return brand;
    }
    async updateBrand(id, dto) {
        const brand = await this.brandModel.findByIdAndUpdate(id, {
            name: dto.name,
            slug: dto.slug,
            description: dto.description,
            logo: dto.logo,
            isActive: dto.isActive,
        }, { new: true });
        if (brand) {
            this.realtimeService.emitBrandUpdate({
                id: brand._id,
                ...brand.toObject(),
            });
        }
        return brand;
    }
    async deleteBrand(id) {
        const brand = await this.brandModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (brand) {
            this.realtimeService.emitBrandDeleted(id);
        }
        return brand;
    }
    async hardDeleteBrand(id) {
        const productCount = await this.productModel.countDocuments({
            brandId: new mongoose_2.Types.ObjectId(id),
        });
        if (productCount > 0) {
            throw new Error('Cannot delete brand with associated products');
        }
        const brand = await this.brandModel.findByIdAndDelete(id);
        if (brand) {
            this.realtimeService.emitBrandDeleted(id);
        }
        return brand;
    }
    async getBrandAnalytics() {
        const [totalBrands, activeBrands, brandCounts] = await Promise.all([
            this.brandModel.countDocuments({ isActive: true }),
            this.brandModel.countDocuments({ isActive: true }),
            this.productModel.aggregate([
                { $match: { brandId: { $ne: null } } },
                {
                    $group: {
                        _id: '$brandId',
                        productCount: { $sum: 1 },
                    },
                },
            ]),
        ]);
        const brandIds = brandCounts.map((item) => item._id).filter(Boolean);
        const brands = await this.brandModel
            .find({ _id: { $in: brandIds }, isActive: true })
            .select('_id name logo')
            .lean();
        const brandById = brands.reduce((acc, brand) => {
            acc[brand._id.toString()] = brand;
            return acc;
        }, {});
        const topBrands = brandCounts
            .map((item) => ({
            id: item._id.toString(),
            name: brandById[item._id.toString()]?.name,
            logo: brandById[item._id.toString()]?.logo,
            productCount: item.productCount,
        }))
            .filter((brand) => brand.name)
            .sort((a, b) => b.productCount - a.productCount)
            .slice(0, 5);
        const revenueByBrand = await this.orderItemModel.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $match: {
                    'product.brandId': { $ne: null },
                },
            },
            {
                $group: {
                    _id: '$product.brandId',
                    revenue: { $sum: { $multiply: ['$quantity', '$price'] } },
                    productCount: { $addToSet: '$product._id' },
                },
            },
            {
                $project: {
                    revenue: 1,
                    productCount: { $size: '$productCount' },
                },
            },
        ]);
        const brandPerformance = revenueByBrand
            .map((item) => ({
            id: item._id.toString(),
            name: brandById[item._id.toString()]?.name,
            logo: brandById[item._id.toString()]?.logo,
            productCount: item.productCount,
            revenue: item.revenue,
        }))
            .filter((brand) => brand.name)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        return {
            totalBrands,
            activeBrands,
            topBrands,
            brandPerformance,
        };
    }
    async getBrandsList() {
        return this.brandModel
            .find({ isActive: true })
            .select('_id name slug')
            .sort({ name: 1 })
            .lean();
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Brand')),
    __param(1, (0, mongoose_1.InjectModel)('Product')),
    __param(2, (0, mongoose_1.InjectModel)('ProductImage')),
    __param(3, (0, mongoose_1.InjectModel)('OrderItem')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        realtime_service_1.RealtimeService])
], BrandsService);
//# sourceMappingURL=brands.service.js.map