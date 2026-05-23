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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const bcrypt = require("bcryptjs");
const ioredis_1 = require("ioredis");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../database/schemas/user.schema");
const otp_verification_schema_1 = require("../../database/schemas/otp-verification.schema");
const otp_service_1 = require("../verification/otp.service");
let AuthService = class AuthService {
    constructor(userModel, otpVerificationModel, jwtService, configService, otpService, emailOtpService) {
        this.userModel = userModel;
        this.otpVerificationModel = otpVerificationModel;
        this.jwtService = jwtService;
        this.configService = configService;
        this.otpService = otpService;
        this.emailOtpService = emailOtpService;
        this.redisClient = null;
    }
    set auditLogService(value) {
        this._auditLogService = value;
    }
    getRefreshTokenTtlSeconds() {
        const raw = this.configService.get('JWT_REFRESH_EXPIRES_IN') ||
            process.env.JWT_REFRESH_EXPIRES_IN ||
            '604800';
        const parsed = parseInt(raw, 10);
        if (!Number.isNaN(parsed) && parsed > 0)
            return parsed;
        return 7 * 24 * 60 * 60;
    }
    onModuleInit() {
        const redisUrl = process.env.REDIS_URL || process.env.THROTTLE_REDIS_URL;
        if (redisUrl) {
            this.redisClient = new ioredis_1.default(redisUrl);
        }
        try {
            const { AuditLogService } = require('../auditlog/auditlog.service');
        }
        catch (e) { }
    }
    async register(dto, ipAddress, deviceFingerprint) {
        const existingUser = await this.userModel
            .findOne({
            $or: [{ email: dto.email }, { phone: dto.phone }],
        })
            .lean();
        if (existingUser) {
            throw new common_1.ConflictException('Email or phone already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.userModel.create({
            email: dto.email,
            phone: dto.phone,
            password: hashedPassword,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: user_schema_1.UserRole.CUSTOMER,
            ipAddress,
            deviceFingerprint,
            isEmailVerified: false,
        });
        const otp = this.otpService.generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this.otpVerificationModel.create({
            userId: user._id,
            phone: user.email,
            otp,
            purpose: 'email_verification',
            expiresAt,
        });
        const sent = await this.emailOtpService.sendEmailOtp(user.email, otp, 'email_verification');
        if (!sent) {
            throw new common_1.BadRequestException('Failed to send verification email');
        }
        const enableTestOtp = process.env.ENABLE_TEST_OTP === 'true';
        const isMockEmail = (process.env.EMAIL_PROVIDER || '').toLowerCase() === 'mock';
        return {
            success: true,
            message: 'Registration successful. Please check your email for verification code.',
            nextStep: 'VERIFY_EMAIL',
            userId: user._id.toString(),
            email: user.email,
            isEmailVerified: false,
            ...(enableTestOtp && isMockEmail ? { testOtp: otp } : {}),
        };
    }
    async login(dto, ipAddress) {
        const user = await this.validateUser(dto.email, dto.password);
        if (!user.isEmailVerified) {
            throw new common_1.ForbiddenException('Please verify your email before logging in. Check your inbox for verification code.');
        }
        await this.userModel.findByIdAndUpdate(user._id, {
            lastLoginAt: new Date(),
            ipAddress,
            failedAttempts: 0,
        }, { new: true });
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                phone: user.phone,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                trustScore: user.trustScore,
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified,
            },
            ...tokens,
        };
    }
    async validateUser(email, password) {
        const user = await this.userModel.findOne({ email }).lean();
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.isBlocked) {
            throw new common_1.UnauthorizedException('Account blocked. Contact support.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            await this.userModel.findByIdAndUpdate(user._id, { $inc: { failedAttempts: 1 } }, { new: true });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const refreshJti = (0, crypto_1.randomBytes)(16).toString('hex');
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN'),
            }),
            this.jwtService.signAsync({ ...payload, jti: refreshJti }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            }),
        ]);
        return {
            accessToken,
            refreshToken,
            refreshJti,
        };
    }
    generateCsrfToken() {
        return (0, crypto_1.randomBytes)(32).toString('hex');
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashedRefreshToken }, { new: true });
    }
    async refreshTokens(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const payload = await this.jwtService.verifyAsync(refreshToken, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
        const user = await this.userModel.findById(new mongoose_2.Types.ObjectId(payload.sub)).lean();
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const incomingJti = payload.jti;
        const storedJti = user.refreshJti;
        if (storedJti && incomingJti && storedJti !== incomingJti) {
            if (this.redisClient) {
                const blacklisted = await this.redisClient.get(`refresh_jti_blacklist:${incomingJti}`);
                if (blacklisted) {
                    await this.userModel.findByIdAndUpdate(user._id, {
                        refreshToken: null,
                        refreshJti: null,
                    });
                    try {
                        if (this._auditLogService) {
                            await this._auditLogService.log('REFRESH_TOKEN_REUSE', user._id, user.email, user._id.toString(), { reason: 'refresh_jti_blacklist' });
                        }
                    }
                    catch { }
                    throw new common_1.UnauthorizedException('Refresh token reuse detected');
                }
            }
            throw new common_1.UnauthorizedException('Access denied');
        }
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isRefreshTokenValid) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const oldJti = storedJti || incomingJti;
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        await this.userModel.findByIdAndUpdate(user._id, { refreshToken: await bcrypt.hash(tokens.refreshToken, 10), refreshJti: tokens.refreshJti }, { new: true });
        if (this.redisClient && oldJti) {
            const ttl = this.getRefreshTokenTtlSeconds();
            try {
                await this.redisClient.setex(`refresh_jti_blacklist:${oldJti}`, ttl, '1');
            }
            catch (e) {
            }
        }
        return tokens;
    }
    async logout(userId) {
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: null }, { new: true });
    }
    async invalidateAllSessions(userId, reason) {
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: null, refreshJti: null }, { new: true });
        try {
            if (this._auditLogService) {
                await this._auditLogService.log('INVALIDATE_ALL_SESSIONS', userId, '', userId.toString(), {
                    reason,
                });
            }
        }
        catch { }
    }
    async forgotPassword(dto) {
        const { email } = dto;
        if (!email) {
            throw new common_1.BadRequestException('Provide email');
        }
        const user = await this.userModel.findOne({ email }).lean();
        if (!user) {
            throw new common_1.NotFoundException('User with this email not found');
        }
        const otp = this.otpService.generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this.otpVerificationModel.create({
            userId: user._id,
            phone: email,
            otp,
            purpose: 'password_reset',
            expiresAt,
        });
        const sent = await this.emailOtpService.sendEmailOtp(email, otp, 'password_reset');
        if (!sent) {
            throw new common_1.BadRequestException('Failed to send password reset email');
        }
        return { message: 'Password reset OTP sent to your email' };
    }
    async resetPassword(dto) {
        const { email, otp, newPassword } = dto;
        const user = await this.userModel.findOne({ email }).lean();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const otpRecord = await this.otpVerificationModel
            .findOne({
            userId: user._id,
            phone: email,
            otp,
            purpose: 'password_reset',
            isVerified: false,
            expiresAt: { $gt: new Date() },
        })
            .sort({ createdAt: -1 })
            .lean();
        if (!otpRecord) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        if (otpRecord.attempts >= 5) {
            throw new common_1.BadRequestException('Maximum attempts exceeded');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            refreshToken: null,
            failedAttempts: 0,
        }, { new: true });
        await this.otpVerificationModel.findByIdAndUpdate(otpRecord._id, { $set: { isVerified: true }, $inc: { attempts: 1 } }, { new: true });
        return { message: 'Password reset successfully' };
    }
    async verifyEmailOtp(dto) {
        const { email, otp } = dto;
        const user = await this.userModel.findOne({ email }).lean();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException('Email already verified. Please login.');
        }
        const otpRecord = await this.otpVerificationModel
            .findOne({
            userId: user._id,
            phone: email,
            otp,
            purpose: 'email_verification',
            isVerified: false,
            expiresAt: { $gt: new Date() },
        })
            .sort({ createdAt: -1 })
            .lean();
        if (!otpRecord) {
            const anyOtpRecord = await this.otpVerificationModel
                .findOne({
                userId: user._id,
                phone: email,
                purpose: 'email_verification',
                isVerified: false,
                expiresAt: { $gt: new Date() },
            })
                .sort({ createdAt: -1 })
                .lean();
            if (anyOtpRecord) {
                await this.otpVerificationModel.findByIdAndUpdate(anyOtpRecord._id, { $inc: { attempts: 1 } }, { new: true });
                throw new common_1.BadRequestException('Wrong code. Please check your email and try again.');
            }
            throw new common_1.BadRequestException('Verification code expired. Please request a new code.');
        }
        if (otpRecord.attempts >= 5) {
            throw new common_1.BadRequestException('Too many failed attempts. Please request a new code.');
        }
        await this.otpVerificationModel.findByIdAndUpdate(otpRecord._id, { $set: { isVerified: true }, $inc: { attempts: 1 } }, { new: true });
        const updatedUser = await this.userModel
            .findByIdAndUpdate(user._id, { isEmailVerified: true, $inc: { trustScore: 20 } }, { new: true })
            .lean();
        const tokens = await this.generateTokens(updatedUser._id.toString(), updatedUser.email, updatedUser.role);
        await this.updateRefreshToken(updatedUser._id.toString(), tokens.refreshToken);
        return {
            success: true,
            message: 'Email verified successfully. You can now login.',
            user: {
                id: updatedUser._id.toString(),
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                role: updatedUser.role,
                isEmailVerified: true,
                trustScore: updatedUser.trustScore,
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
    async resendVerificationOtp(email) {
        const user = await this.userModel.findOne({ email }).lean();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException('Email already verified');
        }
        const otp = this.otpService.generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this.otpVerificationModel.create({
            userId: user._id,
            phone: user.email,
            otp,
            purpose: 'email_verification',
            expiresAt,
        });
        const sent = await this.emailOtpService.sendEmailOtp(user.email, otp, 'email_verification');
        if (!sent) {
            throw new common_1.BadRequestException('Failed to send verification email');
        }
        return {
            message: 'Verification OTP resent successfully. Please check your email.',
        };
    }
    async getEmailDeliveryHealth() {
        return this.emailOtpService.getDeliveryHealth();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(otp_verification_schema_1.OtpVerification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService,
        otp_service_1.OtpService,
        otp_service_1.EmailOtpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map