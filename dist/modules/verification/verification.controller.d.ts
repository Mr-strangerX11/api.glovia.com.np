import { VerificationService } from './verification.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class VerificationController {
    private verificationService;
    constructor(verificationService: VerificationService);
    sendEmailVerification(userId: string, email: string): Promise<{
        message: string;
    }>;
    verifyEmail(userId: string): Promise<{
        message: string;
        trustScore: number;
    }>;
    sendOtp(dto: SendOtpDto, userId: string): Promise<{
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
