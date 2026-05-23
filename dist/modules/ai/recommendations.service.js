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
exports.RecommendationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../../database/schemas/product.schema");
const product_image_schema_1 = require("../../database/schemas/product-image.schema");
let RecommendationsService = class RecommendationsService {
    constructor(productModel, productImageModel) {
        this.productModel = productModel;
        this.productImageModel = productImageModel;
    }
    async getRecommendations(userId, productId) {
        let products = [];
        if (productId && mongoose_2.Types.ObjectId.isValid(productId)) {
            const product = await this.productModel.findById(productId).lean();
            if (product) {
                products = await this.productModel
                    .find({
                    categoryId: product.categoryId,
                    _id: { $ne: product._id },
                    isActive: true,
                })
                    .limit(6)
                    .lean();
                if (products.length === 0) {
                    products = await this.productModel
                        .find({ isActive: true, isBestSeller: true })
                        .limit(6)
                        .lean();
                }
            }
        }
        if (products.length === 0) {
            products = await this.productModel
                .find({ isActive: true, isBestSeller: true })
                .limit(6)
                .lean();
        }
        if (products.length === 0) {
            products = await this.productModel
                .find({ isActive: true })
                .limit(6)
                .lean();
        }
        if (products.length > 0) {
            const productIds = products.map((p) => p._id);
            const images = await this.productImageModel
                .find({ productId: { $in: productIds } })
                .sort({ displayOrder: 1 })
                .lean();
            const imageMap = new Map();
            images.forEach((img) => {
                const key = img.productId.toString();
                if (!imageMap.has(key)) {
                    imageMap.set(key, img);
                }
            });
            products = products.map((product) => ({
                ...product,
                images: imageMap.has(product._id.toString()) ? [imageMap.get(product._id.toString())] : [],
            }));
        }
        return products;
    }
};
exports.RecommendationsService = RecommendationsService;
exports.RecommendationsService = RecommendationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_image_schema_1.ProductImage.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], RecommendationsService);
//# sourceMappingURL=recommendations.service.js.map