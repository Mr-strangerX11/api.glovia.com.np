"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminIpAllowlistGuard = void 0;
const common_1 = require("@nestjs/common");
function getAllowedIps() {
    if (process.env.ADMIN_IP_GUARD_DISABLED === 'true')
        return ['*'];
    const envIps = process.env.ALLOWED_ADMIN_IPS;
    if (envIps) {
        return envIps
            .split(',')
            .map((ip) => ip.trim())
            .filter(Boolean);
    }
    return ['127.0.0.1', '::1'];
}
function getClientIp(request) {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
        const ips = (typeof forwarded === 'string' ? forwarded : forwarded[0])
            .split(',')
            .map((ip) => ip.trim());
        if (ips[0])
            return ips[0];
    }
    const ip = request.ip || (request.connection && request.connection.remoteAddress) || '';
    return ip === '::1' ? '127.0.0.1' : ip.replace(/^::ffff:/, '');
}
let AdminIpAllowlistGuard = class AdminIpAllowlistGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const allowedIps = getAllowedIps();
        if (allowedIps.includes('*'))
            return true;
        const clientIp = getClientIp(request);
        if (!allowedIps.includes(clientIp)) {
            throw new common_1.ForbiddenException('Access denied: Your IP is not allowed.');
        }
        return true;
    }
};
exports.AdminIpAllowlistGuard = AdminIpAllowlistGuard;
exports.AdminIpAllowlistGuard = AdminIpAllowlistGuard = __decorate([
    (0, common_1.Injectable)()
], AdminIpAllowlistGuard);
//# sourceMappingURL=admin-ip-allowlist.guard.js.map