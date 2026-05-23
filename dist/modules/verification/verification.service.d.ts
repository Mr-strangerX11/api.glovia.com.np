import { Model } from 'mongoose';
import { User, Address, Order, OtpVerification } from '../../database/schemas';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailNotificationService } from '../../common/services/email-notification.service';
export declare class VerificationService {
    private userModel;
    private addressModel;
    private orderModel;
    private otpModel;
    private otpService;
    private emailNotificationService;
    constructor(userModel: Model<User>, addressModel: Model<Address>, orderModel: Model<Order>, otpModel: Model<OtpVerification>, otpService: OtpService, emailNotificationService: EmailNotificationService);
    sendVerificationEmail(userId: string, email: string): Promise<void>;
    verifyEmail(userId: string): Promise<{
        message: string;
        trustScore: number;
    }>;
    sendOtp(dto: SendOtpDto, userId?: string): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        message: string;
        trustScore: number;
    }>;
    verifyAddress(userId: string, addressId: string): Promise<{
        message: string;
        trustScore: number;
    }>;
    confirmDelivery(userId: string, orderId: string): Promise<{
        message: string;
        trustScore: number;
    }>;
}
