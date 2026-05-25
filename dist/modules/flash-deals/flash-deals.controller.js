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
exports.FlashDealsController = void 0;
const common_1 = require("@nestjs/common");
const flash_deals_service_1 = require("./flash-deals.service");
const flash_deal_dto_1 = require("./dto/flash-deal.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_schema_1 = require("../../database/schemas/user.schema");
let FlashDealsController = class FlashDealsController {
    constructor(flashDealsService) {
        this.flashDealsService = flashDealsService;
    }
    async getStatistics() {
        const stats = await this.flashDealsService.getStatistics();
        return {
            success: true,
            data: stats,
        };
    }
    async getActiveFlashDeals() {
        const deals = await this.flashDealsService.getActiveFlashDeals();
        return {
            success: true,
            data: deals,
        };
    }
    async getAllFlashDeals(page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 20;
        if (pageNum < 1 || limitNum < 1) {
            throw new common_1.BadRequestException('Page and limit must be positive numbers');
        }
        const result = await this.flashDealsService.getAllFlashDeals(pageNum, limitNum);
        return {
            success: true,
            ...result,
        };
    }
    async getFlashDealById(id) {
        const deal = await this.flashDealsService.getFlashDealById(id);
        return {
            success: true,
            data: deal,
        };
    }
    async createFlashDeal(dto, req) {
        const deal = await this.flashDealsService.createFlashDeal(dto, req.user.id);
        return {
            success: true,
            message: 'Flash deal created successfully',
            data: deal,
        };
    }
    async updateFlashDeal(id, dto, req) {
        const deal = await this.flashDealsService.updateFlashDeal(id, dto, req.user.id);
        return {
            success: true,
            message: 'Flash deal updated successfully',
            data: deal,
        };
    }
    async deleteFlashDeal(id) {
        await this.flashDealsService.deleteFlashDeal(id);
        return {
            success: true,
            message: 'Flash deal deleted successfully',
        };
    }
    async toggleFlashDeal(id) {
        const deal = await this.flashDealsService.toggleFlashDeal(id);
        return {
            success: true,
            message: 'Flash deal toggled successfully',
            data: deal,
        };
    }
    async reorderFlashDeals(deals) {
        await this.flashDealsService.reorderFlashDeals(deals);
        return {
            success: true,
            message: 'Flash deals reordered successfully',
        };
    }
    async recordView(id) {
        await this.flashDealsService.recordView(id);
        return {
            success: true,
        };
    }
    async recordClick(id) {
        await this.flashDealsService.recordClick(id);
        return {
            success: true,
        };
    }
};
exports.FlashDealsController = FlashDealsController;
__decorate([
    (0, common_1.Get)('admin/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FlashDealsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FlashDealsController.prototype, "getActiveFlashDeals", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FlashDealsController.prototype, "getAllFlashDeals", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FlashDealsController.prototype, "getFlashDealById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flash_deal_dto_1.CreateFlashDealDto, Object]),
    __metadata("design:returntype", Promise)
], FlashDealsController.prototype, "createFlashDeal", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, flash_deal_dto_1.UpdateFlashDealDto, Object]),
    __metadata("design:returntype", Promise)
], FlashDealsController.prototype, "updateFlashDeal", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FlashDealsController.prototype, "deleteFlashDeal", null);
__decorate([
    (0, common_1.Put)(':id/toggle'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FlashDealsController.prototype, "toggleFlashDeal", null);
__decorate([
    (0, common_1.Post)('reorder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)('deals')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], FlashDealsController.prototype, "reorderFlashDeals", null);
__decorate([
    (0, common_1.Post)(':id/view'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FlashDealsController.prototype, "recordView", null);
__decorate([
    (0, common_1.Post)(':id/click'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FlashDealsController.prototype, "recordClick", null);
exports.FlashDealsController = FlashDealsController = __decorate([
    (0, common_1.Controller)('flash-deals'),
    __metadata("design:paramtypes", [flash_deals_service_1.FlashDealsService])
], FlashDealsController);
//# sourceMappingURL=flash-deals.controller.js.map