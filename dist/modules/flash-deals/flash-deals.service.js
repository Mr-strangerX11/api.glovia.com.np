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
exports.FlashDealsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const realtime_service_1 = require("../realtime/realtime.service");
let FlashDealsService = class FlashDealsService {
    constructor(flashDealModel, realtimeService) {
        this.flashDealModel = flashDealModel;
        this.realtimeService = realtimeService;
    }
    async getActiveFlashDeals() {
        const now = new Date();
        const deals = await this.flashDealModel
            .find({
            isActive: true,
            startTime: { $lte: now },
            endTime: { $gte: now },
        })
            .sort({ displayOrder: 1 })
            .lean();
        return deals;
    }
    async getAllFlashDeals(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [deals, total] = await Promise.all([
            this.flashDealModel
                .find()
                .sort({ displayOrder: 1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.flashDealModel.countDocuments(),
        ]);
        return {
            data: deals,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getFlashDealById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid flash deal ID');
        }
        const deal = await this.flashDealModel.findById(id).lean();
        if (!deal) {
            throw new common_1.NotFoundException('Flash deal not found');
        }
        return deal;
    }
    async createFlashDeal(dto, adminId) {
        if (dto.startTime >= dto.endTime) {
            throw new common_1.BadRequestException('Start time must be before end time');
        }
        if (!dto.products || dto.products.length === 0) {
            throw new common_1.BadRequestException('At least one product is required');
        }
        const productsWithDiscount = dto.products.map((product) => {
            if (product.salePrice >= product.originalPrice) {
                throw new common_1.BadRequestException('Sale price must be less than original price');
            }
            const discountPercentage = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);
            return {
                ...product,
                discountPercentage,
            };
        });
        const newDeal = new this.flashDealModel({
            title: dto.title,
            description: dto.description,
            products: productsWithDiscount,
            startTime: dto.startTime,
            endTime: dto.endTime,
            adImage: dto.adImage,
            displayOrder: dto.displayOrder || 0,
            createdBy: new mongoose_2.Types.ObjectId(adminId),
        });
        const savedDeal = await newDeal.save();
        this.realtimeService.emitFlashDealCreated({
            id: savedDeal._id,
            ...savedDeal.toObject(),
        });
        return savedDeal;
    }
    async updateFlashDeal(id, dto, adminId) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid flash deal ID');
        }
        if (dto.startTime && dto.endTime && dto.startTime >= dto.endTime) {
            throw new common_1.BadRequestException('Start time must be before end time');
        }
        const updateData = {
            updatedBy: new mongoose_2.Types.ObjectId(adminId),
        };
        if (dto.title !== undefined)
            updateData.title = dto.title;
        if (dto.description !== undefined)
            updateData.description = dto.description;
        if (dto.adImage !== undefined)
            updateData.adImage = dto.adImage;
        if (dto.displayOrder !== undefined)
            updateData.displayOrder = dto.displayOrder;
        if (dto.startTime !== undefined)
            updateData.startTime = dto.startTime;
        if (dto.endTime !== undefined)
            updateData.endTime = dto.endTime;
        if (dto.isActive !== undefined)
            updateData.isActive = dto.isActive;
        if (dto.products !== undefined) {
            if (dto.products.length === 0) {
                throw new common_1.BadRequestException('At least one product is required');
            }
            const productsWithDiscount = dto.products.map((product) => {
                if (product.salePrice >= product.originalPrice) {
                    throw new common_1.BadRequestException('Sale price must be less than original price');
                }
                const discountPercentage = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);
                return {
                    ...product,
                    discountPercentage,
                };
            });
            updateData.products = productsWithDiscount;
        }
        const deal = await this.flashDealModel.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        if (!deal) {
            throw new common_1.NotFoundException('Flash deal not found');
        }
        this.realtimeService.emitFlashDealUpdate({
            id: deal._id,
            ...deal.toObject(),
        });
        return deal;
    }
    async deleteFlashDeal(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid flash deal ID');
        }
        const deal = await this.flashDealModel.findByIdAndDelete(id);
        if (!deal) {
            throw new common_1.NotFoundException('Flash deal not found');
        }
        this.realtimeService.emitFlashDealDeleted(id);
        return { message: 'Flash deal deleted successfully' };
    }
    async reorderFlashDeals(deals) {
        for (const deal of deals) {
            if (!mongoose_2.Types.ObjectId.isValid(deal.id)) {
                throw new common_1.BadRequestException('Invalid flash deal ID');
            }
            await this.flashDealModel.findByIdAndUpdate(deal.id, {
                displayOrder: deal.order,
            });
        }
        return { message: 'Flash deals reordered successfully' };
    }
    async toggleFlashDeal(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid flash deal ID');
        }
        const deal = await this.flashDealModel.findById(id);
        if (!deal) {
            throw new common_1.NotFoundException('Flash deal not found');
        }
        deal.isActive = !deal.isActive;
        return await deal.save();
    }
    async recordView(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            return;
        await this.flashDealModel.findByIdAndUpdate(id, {
            $inc: { views: 1 },
        });
    }
    async recordClick(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            return;
        await this.flashDealModel.findByIdAndUpdate(id, {
            $inc: { clicks: 1 },
        });
    }
    async getStatistics() {
        const now = new Date();
        const [active, upcoming, expired, total] = await Promise.all([
            this.flashDealModel.countDocuments({
                isActive: true,
                startTime: { $lte: now },
                endTime: { $gte: now },
            }),
            this.flashDealModel.countDocuments({
                startTime: { $gt: now },
            }),
            this.flashDealModel.countDocuments({
                endTime: { $lt: now },
            }),
            this.flashDealModel.countDocuments(),
        ]);
        const totalViews = await this.flashDealModel.aggregate([
            { $group: { _id: null, views: { $sum: '$views' } } },
        ]);
        const totalClicks = await this.flashDealModel.aggregate([
            { $group: { _id: null, clicks: { $sum: '$clicks' } } },
        ]);
        return {
            active,
            upcoming,
            expired,
            total,
            totalViews: totalViews[0]?.views || 0,
            totalClicks: totalClicks[0]?.clicks || 0,
        };
    }
};
exports.FlashDealsService = FlashDealsService;
exports.FlashDealsService = FlashDealsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('FlashDeal')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        realtime_service_1.RealtimeService])
], FlashDealsService);
//# sourceMappingURL=flash-deals.service.js.map