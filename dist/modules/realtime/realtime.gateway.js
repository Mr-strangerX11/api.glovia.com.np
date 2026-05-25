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
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../database/schemas/user.schema");
function getAllowedOrigins() {
    const raw = process.env.FRONTEND_URL || 'http://localhost:3000';
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
}
let RealtimeGateway = class RealtimeGateway {
    constructor(jwtService, configService, userModel) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userModel = userModel;
        this.logger = new common_1.Logger('RealtimeGateway');
    }
    afterInit(server) {
        this.logger.log('WebSocket Gateway initialized');
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        try {
            const token = client.handshake?.auth?.token ||
                (client.handshake?.headers?.authorization?.startsWith('Bearer ')
                    ? client.handshake.headers.authorization.slice(7)
                    : undefined) ||
                (client.handshake?.headers?.cookie &&
                    (() => {
                        const cookieHeader = client.handshake.headers.cookie;
                        const match = cookieHeader
                            .split(';')
                            .map((p) => p.trim())
                            .find((p) => p.startsWith('access_token='));
                        if (match)
                            return decodeURIComponent(match.slice('access_token='.length));
                        return undefined;
                    })());
            if (!token) {
                this.logger.warn(`Client ${client.id} missing token`);
                client.disconnect(true);
                return;
            }
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            const user = this.userModel
                .findById(new mongoose_2.Types.ObjectId(payload.sub))
                .select('email firstName lastName role')
                .lean();
            Promise.resolve(user)
                .then((u) => {
                if (!u) {
                    client.disconnect(true);
                    return;
                }
                client.data.user = {
                    id: u._id.toString(),
                    email: u.email,
                    role: u.role,
                };
                this.logger.log(`Client ${client.id} authenticated as user ${client.data.user.id}`);
            })
                .catch((err) => {
                this.logger.warn(`Auth error for client ${client.id}: ${err?.message || err}`);
                client.disconnect(true);
            });
        }
        catch (err) {
            this.logger.warn(`Client ${client.id} failed auth: ${err?.message || err}`);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleSubscribe(client, data) {
        if (!client.data.user)
            throw new common_1.UnauthorizedException('Not authenticated');
        client.join(data.channel);
        this.logger.log(`Client ${client.id} subscribed to ${data.channel}`);
        return { status: 'subscribed', channel: data.channel };
    }
    handleUnsubscribe(client, data) {
        if (!client.data.user)
            throw new common_1.UnauthorizedException('Not authenticated');
        client.leave(data.channel);
        this.logger.log(`Client ${client.id} unsubscribed from ${data.channel}`);
        return { status: 'unsubscribed', channel: data.channel };
    }
    emitToChannel(channel, event, data) {
        this.server.to(channel).emit(event, data);
        this.logger.log(`Emitted ${event} to channel ${channel}`);
    }
    broadcastEvent(event, data) {
        this.server.emit(event, data);
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleSubscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleUnsubscribe", null);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: getAllowedOrigins(),
            methods: ['GET', 'POST'],
            credentials: true,
        },
        namespace: '/realtime',
    }),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        mongoose_2.Model])
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map