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
exports.VendorActiveGuard = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let VendorActiveGuard = class VendorActiveGuard {
    constructor(userModel) {
        this.userModel = userModel;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id;
        if (!userId) {
            return true;
        }
        return this.validateVendorStatus(userId);
    }
    async validateVendorStatus(userId) {
        const user = await this.userModel.findById(userId).select('isFrozen frozenReason').lean();
        if (!user) {
            return true;
        }
        if (user.isFrozen) {
            throw new common_1.ForbiddenException(`Your vendor account has been frozen. Reason: ${user.frozenReason || 'Not specified'}. Please contact support.`);
        }
        return true;
    }
};
exports.VendorActiveGuard = VendorActiveGuard;
exports.VendorActiveGuard = VendorActiveGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VendorActiveGuard);
//# sourceMappingURL=vendor-active.guard.js.map