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
exports.VendorAuthService = exports.VendorAuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../database/schemas/user.schema");
let VendorAuthMiddleware = class VendorAuthMiddleware {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async use(req, res, next) {
        const path = req.path;
        const method = req.method;
        const vendorProtectedRoutes = [
            /^\/api\/v1\/vendors\/orders\/my-orders/,
            /^\/api\/v1\/products\/my-products/,
        ];
        const isProtectedRoute = vendorProtectedRoutes.some((route) => route.test(path));
        if (!isProtectedRoute) {
            return next();
        }
        const user = req.user;
        if (!user) {
            throw new common_1.ForbiddenException('Authentication required for this resource');
        }
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            return next();
        }
        if (user.role === 'VENDOR') {
            const vendorIdParam = req.params.vendorId;
            if (vendorIdParam && vendorIdParam !== user.id) {
                throw new common_1.ForbiddenException('You can only access your own vendor data');
            }
            return next();
        }
        if (user.role === 'CUSTOMER') {
            throw new common_1.ForbiddenException('Customers cannot access vendor endpoints');
        }
        return next();
    }
};
exports.VendorAuthMiddleware = VendorAuthMiddleware;
exports.VendorAuthMiddleware = VendorAuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VendorAuthMiddleware);
let VendorAuthService = class VendorAuthService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async canCreateProductForVendor(userId, targetVendorId, userRole) {
        if (userRole === 'SUPER_ADMIN') {
            return true;
        }
        if (userRole === 'ADMIN') {
            return true;
        }
        if (userRole === 'VENDOR') {
            return userId === targetVendorId;
        }
        return false;
    }
    async canViewVendorOrders(userId, targetVendorId, userRole) {
        if (userRole === 'SUPER_ADMIN') {
            return true;
        }
        if (userRole === 'ADMIN') {
            return true;
        }
        if (userRole === 'VENDOR') {
            return userId === targetVendorId;
        }
        return false;
    }
    async canModifyProduct(userId, productVendorId, userRole) {
        if (userRole === 'SUPER_ADMIN') {
            return true;
        }
        if (userRole === 'ADMIN') {
            return true;
        }
        if (userRole === 'VENDOR') {
            return userId === productVendorId;
        }
        return false;
    }
};
exports.VendorAuthService = VendorAuthService;
exports.VendorAuthService = VendorAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VendorAuthService);
//# sourceMappingURL=vendor-auth.middleware.js.map