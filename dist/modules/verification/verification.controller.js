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
exports.VerificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const verification_service_1 = require("./verification.service");
const send_otp_dto_1 = require("./dto/send-otp.dto");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let VerificationController = class VerificationController {
    constructor(verificationService) {
        this.verificationService = verificationService;
    }
    async sendEmailVerification(userId, email) {
        await this.verificationService.sendVerificationEmail(userId, email);
        return { message: 'Verification email sent' };
    }
    async verifyEmail(userId) {
        return this.verificationService.verifyEmail(userId);
    }
    async sendOtp(dto, userId) {
        return this.verificationService.sendOtp(dto, userId);
    }
    async verifyOtp(dto) {
        return this.verificationService.verifyOtp(dto);
    }
    async verifyAddress(userId, addressId) {
        return this.verificationService.verifyAddress(userId, addressId);
    }
    async confirmDelivery(userId, orderId) {
        return this.verificationService.confirmDelivery(userId, orderId);
    }
};
exports.VerificationController = VerificationController;
__decorate([
    (0, common_1.Post)('email/send'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send email verification (resend)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VerificationController.prototype, "sendEmailVerification", null);
__decorate([
    (0, common_1.Post)('email/verify/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify email using token from email link' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VerificationController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('otp/send'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send OTP to phone' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_otp_dto_1.SendOtpDto, String]),
    __metadata("design:returntype", Promise)
], VerificationController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)('otp/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify OTP code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], VerificationController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('address/:addressId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Verify address (admin/delivery confirmation)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('addressId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VerificationController.prototype, "verifyAddress", null);
__decorate([
    (0, common_1.Post)('delivery/:orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm delivery and boost trust score' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VerificationController.prototype, "confirmDelivery", null);
exports.VerificationController = VerificationController = __decorate([
    (0, swagger_1.ApiTags)('Verification'),
    (0, common_1.Controller)('verification'),
    __metadata("design:paramtypes", [verification_service_1.VerificationService])
], VerificationController);
//# sourceMappingURL=verification.controller.js.map