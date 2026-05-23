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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
let CategoriesGateway = class CategoriesGateway {
    constructor() {
        this.logger = new common_1.Logger('CategoriesGateway');
    }
    afterInit(server) {
        this.logger.log('WebSocket Gateway initialized');
    }
    handleConnection(client, ...args) {
        this.logger.log(`Client connected: ${client.id}`);
        client.join('categories');
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleSubscribe(client, data) {
        this.logger.log(`Client ${client.id} subscribed to categories`);
        client.join('categories');
        return { event: 'subscribed', message: 'Connected to categories updates' };
    }
    broadcastCategoryUpdate(category) {
        this.server.to('categories').emit('category-updated', {
            event: 'category-updated',
            data: category,
            timestamp: new Date(),
        });
    }
    broadcastSubcategoryCreated(subcategory, parentCategoryId) {
        this.server.to('categories').emit('subcategory-created', {
            event: 'subcategory-created',
            data: subcategory,
            parentCategoryId,
            timestamp: new Date(),
        });
    }
    broadcastCategoriesUpdate(categories) {
        this.server.to('categories').emit('categories-updated', {
            event: 'categories-updated',
            data: categories,
            timestamp: new Date(),
        });
    }
};
exports.CategoriesGateway = CategoriesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CategoriesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe-categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], CategoriesGateway.prototype, "handleSubscribe", null);
exports.CategoriesGateway = CategoriesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'https://glovia.com.np',
            credentials: true,
        },
    })
], CategoriesGateway);
//# sourceMappingURL=categories.gateway.js.map