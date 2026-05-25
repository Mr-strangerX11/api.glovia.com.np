import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

function getAllowedIps(): string[] {
  // ADMIN_IP_GUARD_DISABLED takes priority over ALLOWED_ADMIN_IPS
  if (process.env.ADMIN_IP_GUARD_DISABLED === 'true') return ['*'];

  const envIps = process.env.ALLOWED_ADMIN_IPS;
  if (envIps) {
    return envIps
      .split(',')
      .map((ip) => ip.trim())
      .filter(Boolean);
  }

  return ['127.0.0.1', '::1'];
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
