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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashDealSchema = exports.FlashDeal = exports.FlashDealProduct = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
class FlashDealProduct {
}
exports.FlashDealProduct = FlashDealProduct;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], FlashDealProduct.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FlashDealProduct.prototype, "productName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FlashDealProduct.prototype, "productImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], FlashDealProduct.prototype, "originalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], FlashDealProduct.prototype, "salePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], FlashDealProduct.prototype, "discountPercentage", void 0);
let FlashDeal = class FlashDeal extends mongoose_2.Document {
};
exports.FlashDeal = FlashDeal;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FlashDeal.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FlashDeal.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [FlashDealProduct], required: true, default: [] }),
    __metadata("design:type", Array)
], FlashDeal.prototype, "products", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], FlashDeal.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], FlashDeal.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], FlashDeal.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FlashDeal.prototype, "adImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], FlashDeal.prototype, "displayOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], FlashDeal.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], FlashDeal.prototype, "updatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], FlashDeal.prototype, "views", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], FlashDeal.prototype, "clicks", void 0);
exports.FlashDeal = FlashDeal = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'flash_deals' })
], FlashDeal);
exports.FlashDealSchema = mongoose_1.SchemaFactory.createForClass(FlashDeal);
exports.FlashDealSchema.index({ isActive: 1, endTime: 1 });
exports.FlashDealSchema.index({ startTime: 1, endTime: 1 });
exports.FlashDealSchema.index({ displayOrder: 1 });
//# sourceMappingURL=flash-deal.schema.js.map