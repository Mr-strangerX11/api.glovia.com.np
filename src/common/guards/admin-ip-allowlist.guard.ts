import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

function getAllowedIps(): string[] {
  // Explicitly disabled
  if (process.env.ADMIN_IP_GUARD_DISABLED === 'true') return ['*'];

  // Only enforce IP restriction when ALLOWED_ADMIN_IPS is explicitly set
  const envIps = process.env.ALLOWED_ADMIN_IPS;
  if (envIps && envIps.trim()) {
    return envIps
      .split(',')
      .map((ip) => ip.trim())
      .filter(Boolean);
  }

  // Default: allow all (guard is opt-in via ALLOWED_ADMIN_IPS)
  return ['*'];
}

function getClientIp(request: Request): string {
  // Behind cPanel/Apache reverse proxy, real IP is in X-Forwarded-For
  const forwarded = request.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = (typeof forwarded === 'string' ? forwarded : forwarded[0])
      .split(',')
      .map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }
  const ip = request.ip || (request.connection && request.connection.remoteAddress) || '';
  return ip === '::1' ? '127.0.0.1' : ip.replace(/^::ffff:/, '');
}

@Injectable()
export class AdminIpAllowlistGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const allowedIps = getAllowedIps();

    // If wildcard is set, allow all (useful for development or when guard disabled)
    if (allowedIps.includes('*')) return true;

    const clientIp = getClientIp(request);

    if (!allowedIps.includes(clientIp)) {
      throw new ForbiddenException('Access denied: Your IP is not allowed.');
    }
    return true;
  }
}
