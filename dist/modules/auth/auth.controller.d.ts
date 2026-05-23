import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailOtpDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { UserRole } from '../../database/schemas/user.schema';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, req: Request): Promise<{
        testOtp?: string;
        success: boolean;
        message: string;
        nextStep: string;
        userId: string;
        email: string;
        isEmailVerified: boolean;
    }>;
    verifyEmailOtp(dto: VerifyEmailOtpDto, res: Response): Promise<any>;
    resendVerificationOtp(email: string): Promise<{
        message: string;
    }>;
    login(dto: LoginDto, req: Request, res: Response): Promise<{
        user: {
            id: string;
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            role: UserRole;
            trustScore: number;
            isEmailVerified: true;
            isPhoneVerified: boolean;
        };
        message: string;
    }>;
    refresh(dto: RefreshTokenDto, req: Request, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, res: Response): Promise<{
        message: string;
    }>;
    invalidateSessions(userId: string, res: Response): Promise<{
        message: string;
    }>;
    getProfile(user: any): Promise<any>;
    getEmailHealth(user: any): Promise<{
        nodeEnv: string;
        configuredProvider: string;
        providerSequence: ("mock" | "smtp" | "sendgrid" | "ses")[];
        allowMockFallback: boolean;
        smtp: {
            configured: boolean;
            hostConfigured: boolean;
            port: number;
            secure: boolean;
            usernameConfigured: boolean;
            passwordConfigured: boolean;
            fromEmailConfigured: boolean;
            verified: boolean;
            verifyError: string;
        };
        sendgrid: {
            configured: boolean;
            fromEmailConfigured: boolean;
        };
        canAttemptRealDelivery: boolean;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
