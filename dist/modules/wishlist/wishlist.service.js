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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const wishlist_item_schema_1 = require("../../database/schemas/wishlist-item.schema");
const product_schema_1 = require("../../database/schemas/product.schema");
const product_image_schema_1 = require("../../database/schemas/product-image.schema");
let WishlistService = class WishlistService {
    constructor(wishlistModel, productModel, productImageModel) {
        this.wishlistModel = wishlistModel;
        this.productModel = productModel;
        this.productImageModel = productImageModel;
    }
    async getWishlist(userId) {
        const wishlistItems = await this.wishlistModel
            .find({
            userId: new mongoose_2.Types.ObjectId(userId),
        })
            .lean();
        const productIds = wishlistItems.map((w) => w.productId);
        const [products, images] = await Promise.all([
            this.productModel.find({ _id: { $in: productIds } }).lean(),
            this.productImageModel.find({ productId: { $in: productIds } }).lean(),
        ]);
        const productMap = products.reduce((acc, p) => {
            acc[p._id.toString()] = p;
            return acc;
        }, {});
        const imagesByProduct = images.reduce((acc, img) => {
            const key = img.productId.toString();
            if (!acc[key])
                acc[key] = [];
            acc[key].push(img);
            return acc;
        }, {});
        return wishlistItems.map((item) => ({
            ...item,
            product: {
                ...productMap[item.productId.toString()],
                images: imagesByProduct[item.productId.toString()] || [],
            },
        }));
    }
    async addToWishlist(userId, productId) {
        if (!mongoose_2.Types.ObjectId.isValid(productId)) {
            throw new common_1.NotFoundException('Invalid product ID');
        }
        const product = await this.productModel.findById(productId).lean();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const userObjId = new mongoose_2.Types.ObjectId(userId);
        const productObjId = new mongoose_2.Types.ObjectId(productId);
        const existing = await this.wishlistModel
            .findOne({
            userId: userObjId,
            productId: productObjId,
        })
            .lean();
        if (existing) {
            return existing;
        }
        const wishlistItem = new this.wishlistModel({
            userId: userObjId,
            productId: productObjId,
        });
        return wishlistItem.save();
    }
    async removeFromWishlist(userId, itemId) {
        if (!mongoose_2.Types.ObjectId.isValid(itemId)) {
            throw new common_1.NotFoundException('Invalid item ID');
        }
        const item = await this.wishlistModel.findOne({
            _id: new mongoose_2.Types.ObjectId(itemId),
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (!item) {
            throw new common_1.NotFoundException('Wishlist item not found');
        }
        await this.wishlistModel.deleteOne({ _id: new mongoose_2.Types.ObjectId(itemId) });
        return { message: 'Item removed from wishlist' };
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(wishlist_item_schema_1.WishlistItem.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_image_schema_1.ProductImage.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map