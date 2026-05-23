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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const otp_service_1 = require("./otp.service");
const email_notification_service_1 = require("../../common/services/email-notification.service");
let VerificationService = class VerificationService {
    constructor(userModel, addressModel, orderModel, otpModel, otpService, emailNotificationService) {
        this.userModel = userModel;
        this.addressModel = addressModel;
        this.orderModel = orderModel;
        this.otpModel = otpModel;
        this.otpService = otpService;
        this.emailNotificationService = emailNotificationService;
    }
    async sendVerificationEmail(userId, email) {
        const user = await this.userModel.findById(userId).lean();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const customerName = user.firstName || 'User';
        await this.emailNotificationService.sendVerificationEmail(email, customerName, userId);
    }
    async verifyEmail(userId) {
        const user = await this.userModel.findById(userId).lean();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isEmailVerified) {
            return { message: 'Email already verified', trustScore: user.trustScore };
        }
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, {
            isEmailVerified: true,
            $inc: { trustScore: 20 },
        }, { new: true })
            .lean();
        return {
            message: 'Email verified successfully',
            trustScore: updatedUser.trustScore,
        };
    }
    async sendOtp(dto, userId) {
        const { phone, purpose } = dto;
        const user = await this.userModel.findOne({ phone }).lean();
        if (!user && !userId) {
            throw new common_1.NotFoundException('User not found');
        }
        const targetUserId = userId || user._id.toString();
        const existingOtp = await this.otpModel
            .findOne({
            userId: new mongoose_2.Types.ObjectId(targetUserId),
            phone,
            purpose,
            expiresAt: { $gt: new Date() },
            isVerified: false,
        })
            .sort({ createdAt: -1 })
            .lean();
        if (existingOtp) {
            const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
            if (existingOtp.createdAt > oneMinuteAgo) {
                throw new common_1.BadRequestException('Please wait before requesting another OTP');
            }
        }
        const otp = this.otpService.generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await this.otpModel.create({
            userId: new mongoose_2.Types.ObjectId(targetUserId),
            phone,
            otp,
            purpose,
            expiresAt,
        });
        const sent = await this.otpService.sendOtp(phone, otp, purpose);
        if (!sent) {
            throw new common_1.BadRequestException('Failed to send OTP');
        }
        return { message: 'OTP sent successfully' };
    }
    async verifyOtp(dto) {
        const { phone, otp } = dto;
        const user = await this.userModel.findOne({ phone }).lean();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const otpRecord = await this.otpModel
            .findOne({
            userId: new mongoose_2.Types.ObjectId(user._id.toString()),
            phone,
            otp,
            isVerified: false,
            expiresAt: { $gt: new Date() },
        })
            .sort({ createdAt: -1 })
            .lean();
        if (!otpRecord) {
            await this.userModel.findByIdAndUpdate(user._id, {
                $inc: { failedAttempts: 1 },
            });
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        if (otpRecord.attempts >= 5) {
            throw new common_1.BadRequestException('Maximum verification attempts exceeded');
        }
        await this.otpModel.findByIdAndUpdate(otpRecord._id, {
            isVerified: true,
        });
        const updatedUser = await this.userModel
            .findByIdAndUpdate(user._id, {
            isPhoneVerified: true,
            $inc: { trustScore: 30 },
            failedAttempts: 0,
        }, { new: true })
            .lean();
        return {
            message: 'Phone verified successfully',
            trustScore: updatedUser.trustScore,
        };
    }
    async verifyAddress(userId, addressId) {
        const address = await this.addressModel
            .findOne({
            _id: new mongoose_2.Types.ObjectId(addressId),
            userId: new mongoose_2.Types.ObjectId(userId),
        })
            .lean();
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        await this.addressModel.findByIdAndUpdate(addressId, {
            isVerified: true,
        });
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, { $inc: { trustScore: 20 } }, { new: true })
            .lean();
        return {
            message: 'Address verified successfully',
            trustScore: updatedUser.trustScore,
        };
    }
    async confirmDelivery(userId, orderId) {
        const order = await this.orderModel
            .findOne({
            _id: new mongoose_2.Types.ObjectId(orderId),
            userId: new mongoose_2.Types.ObjectId(userId),
        })
            .lean();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        await this.addressModel.updateMany({ userId: new mongoose_2.Types.ObjectId(userId) }, { isVerified: true });
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, { $inc: { trustScore: 30 } }, { new: true })
            .lean();
        return {
            message: 'Delivery confirmed. User marked as genuine.',
            trustScore: updatedUser.trustScore,
        };
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __param(1, (0, mongoose_1.InjectModel)('Address')),
    __param(2, (0, mongoose_1.InjectModel)('Order')),
    __param(3, (0, mongoose_1.InjectModel)('OtpVerification')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        otp_service_1.OtpService,
        email_notification_service_1.EmailNotificationService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map