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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_schema_1 = require("../../database/schemas/user.schema");
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;
const isProduction = process.env.NODE_ENV === 'production';
const authCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    domain: COOKIE_DOMAIN,
};
const csrfCookieOptions = {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    path: '/',
    domain: COOKIE_DOMAIN,
};
function getCookieValue(req, name) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader)
        return undefined;
    const match = cookieHeader
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`));
    if (!match)
        return undefined;
    const value = match.slice(name.length + 1);
    try {
        return decodeURIComponent(value);
    }
    catch {
        return value;
    }
}
function setAuthCookies(res, accessToken, refreshToken, csrfToken) {
    res.cookie('access_token', accessToken, authCookieOptions);
    res.cookie('refresh_token', refreshToken, authCookieOptions);
    res.cookie('csrf_token', csrfToken, csrfCookieOptions);
}
function clearAuthCookies(res) {
    res.clearCookie('access_token', authCookieOptions);
    res.clearCookie('refresh_token', authCookieOptions);
    res.clearCookie('csrf_token', csrfCookieOptions);
}
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto, req) {
        const ipAddress = req.ip || req.socket.remoteAddress;
        const deviceFingerprint = req.headers['user-agent'];
        return this.authService.register(dto, ipAddress, deviceFingerprint);
    }
    async verifyEmailOtp(dto, res) {
        const result = await this.authService.verifyEmailOtp(dto);
        if (result.accessToken && result.refreshToken) {
            setAuthCookies(res, result.accessToken, result.refreshToken, this.authService.generateCsrfToken());
        }
        const { accessToken, refreshToken, ...safeResult } = result;
        return safeResult;
    }
    async resendVerificationOtp(email) {
        return this.authService.resendVerificationOtp(email);
    }
    async login(dto, req, res) {
        const ipAddress = req.ip || req.socket.remoteAddress;
        const result = await this.authService.login(dto, ipAddress);
        setAuthCookies(res, result.accessToken, result.refreshToken, this.authService.generateCsrfToken());
        return {
            user: result.user,
            message: 'Login successful',
        };
    }
    async refresh(dto, req, res) {
        const refreshToken = getCookieValue(req, 'refresh_token') || dto.refreshToken;
        const result = await this.authService.refreshTokens(refreshToken || '');
        setAuthCookies(res, result.accessToken, result.refreshToken, this.authService.generateCsrfToken());
        return { accessToken: result.accessToken, refreshToken: result.refreshToken };
    }
    async logout(userId, res) {
        await this.authService.logout(userId);
        clearAuthCookies(res);
        return { message: 'Logged out successfully' };
    }
    async invalidateSessions(userId, res) {
        await this.authService.invalidateAllSessions(userId, 'user_requested');
        clearAuthCookies(res);
        return { message: 'All sessions invalidated' };
    }
    async getProfile(user) {
        return user;
    }
    async getEmailHealth(user) {
        const role = user?.role;
        if (role !== user_schema_1.UserRole.ADMIN && role !== user_schema_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        return this.authService.getEmailDeliveryHealth();
    }
    async forgotPassword(dto) {
        return this.authService.forgotPassword(dto);
    }
    async resetPassword(dto) {
        return this.authService.resetPassword(dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Register new user (sends email verification OTP)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verify email with OTP code (required to complete registration)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.VerifyEmailOtpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmailOtp", null);
__decorate([
    (0, common_1.Post)('verify-email/resend'),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 300000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Resend email verification OTP' }),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerificationOtp", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'User login (requires verified email)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RefreshTokenDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'User logout' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('invalidate-sessions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Invalidate all sessions (logout everywhere)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "invalidateSessions", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('email-health'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get email delivery diagnostics (admin only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getEmailHealth", null);
__decorate([
    (0, common_1.Post)('password/forgot'),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate password reset (phone-based OTP)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('password/reset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password using OTP' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map