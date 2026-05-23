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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    initiateEsewa(orderId) {
        return this.paymentsService.initiateEsewaPayment(orderId);
    }
    verifyEsewa(data) {
        return this.paymentsService.verifyEsewaPayment(data);
    }
    initiateKhalti(orderId) {
        return this.paymentsService.initiateKhaltiPayment(orderId);
    }
    verifyKhalti(data) {
        return this.paymentsService.verifyKhaltiPayment(data);
    }
    initiateIME(orderId) {
        return this.paymentsService.initiateIMEPayment(orderId);
    }
    verifyIME(data) {
        return this.paymentsService.verifyIMEPayment(data);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('esewa/initiate/:orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate eSewa payment' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initiateEsewa", null);
__decorate([
    (0, common_1.Post)('esewa/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify eSewa payment' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "verifyEsewa", null);
__decorate([
    (0, common_1.Post)('khalti/initiate/:orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Khalti payment' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initiateKhalti", null);
__decorate([
    (0, common_1.Post)('khalti/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Khalti payment' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "verifyKhalti", null);
__decorate([
    (0, common_1.Post)('imepay/initiate/:orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate IME Pay payment' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initiateIME", null);
__decorate([
    (0, common_1.Post)('imepay/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify IME Pay payment' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "verifyIME", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map