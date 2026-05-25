import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailOtpDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Request, Response } from 'express';
import { UserRole } from '../../database/schemas/user.schema';

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;
const isProduction = process.env.NODE_ENV === 'production';

// SameSite=None + Secure is required for cookies to be sent on cross-subdomain
// XHR requests (glovia.com.np → backend.glovia.com.np). Lax blocks them entirely.
const authCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  path: '/',
  domain: COOKIE_DOMAIN,
};

const csrfCookieOptions = {
  httpOnly: false,
  secure: true,
  sameSite: 'none' as const,
  path: '/',
  domain: COOKIE_DOMAIN,
};

function getCookieValue(req: Request, name: string) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;

  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!match) return undefined;

  const value = match.slice(name.length + 1);
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
  csrfToken: string
) {
  res.cookie('access_token', accessToken, authCookieOptions as any);
  res.cookie('refresh_token', refreshToken, authCookieOptions as any);
  res.cookie('csrf_token', csrfToken, csrfCookieOptions as any);
}

function clearAuthCookies(res: Response) {
  res.clearCookie('access_token', authCookieOptions as any);
  res.clearCookie('refresh_token', authCookieOptions as any);
  res.clearCookie('csrf_token', csrfCookieOptions as any);
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Register new user (sends email verification OTP)' })
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const deviceFingerprint = req.headers['user-agent'];
    return this.authService.register(dto, ipAddress, deviceFingerprint);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with OTP code (required to complete registration)' })
  async verifyEmailOtp(@Body() dto: VerifyEmailOtpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyEmailOtp(dto);
    if (result.accessToken && result.refreshToken) {
      setAuthCookies(
        res,
        result.accessToken,
        result.refreshToken,
        this.authService.generateCsrfToken()
      );
    }

    const { accessToken, refreshToken, ...safeResult } = result as any;
    return safeResult;
  }

  @Post('verify-email/resend')
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email verification OTP' })
  async resendVerificationOtp(@Body('email') email: string) {
    return this.authService.resendVerificationOtp(email);
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login (requires verified email)' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const result = await this.authService.login(dto, ipAddress);
    setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
      this.authService.generateCsrfToken()
    );

    return {
      user: result.user,
      message: 'Login successful',
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = getCookieValue(req, 'refresh_token') || dto.refreshToken;
    const result = await this.authService.refreshTokens(refreshToken || '');
    setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
      this.authService.generateCsrfToken()
    );
    return { accessToken: result.accessToken, refreshToken: result.refreshToken };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  async logout(@CurrentUser('id') userId: string, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(userId);
    clearAuthCookies(res);
    return { message: 'Logged out successfully' };
  }

  @Post('invalidate-sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Invalidate all sessions (logout everywhere)' })
  async invalidateSessions(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.invalidateAllSessions(userId, 'user_requested');
    clearAuthCookies(res);
    return { message: 'All sessions invalidated' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  async getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Get('email-health')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get email delivery diagnostics (admin only)' })
  async getEmailHealth(@CurrentUser() user: any) {
    const role = user?.role;
    if (role !== UserRole.ADMIN && role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Admin access required');
    }
    return this.authService.getEmailDeliveryHealth();
  }

  @Post('password/forgot')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate password reset (phone-based OTP)' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using OTP' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
