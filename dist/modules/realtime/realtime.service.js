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
exports.RealtimeService = void 0;
const common_1 = require("@nestjs/common");
const realtime_gateway_1 = require("./realtime.gateway");
let RealtimeService = class RealtimeService {
    constructor(realtimeGateway) {
        this.realtimeGateway = realtimeGateway;
    }
    emitProductUpdate(data) {
        this.realtimeGateway.emitToChannel('products', 'product:updated', {
            timestamp: new Date(),
            ...data,
        });
    }
    emitProductCreated(data) {
        this.realtimeGateway.emitToChannel('products', 'product:created', {
            timestamp: new Date(),
            ...data,
        });
    }
    emitProductDeleted(productId) {
        this.realtimeGateway.emitToChannel('products', 'product:deleted', {
            productId,
            timestamp: new Date(),
        });
    }
    emitBannerUpdate(data) {
        this.realtimeGateway.emitToChannel('banners', 'banner:updated', {
            timestamp: new Date(),
            ...data,
        });
    }
    emitBannerCreated(data) {
        this.realtimeGateway.emitToChannel('banners', 'banner:created', {
            timestamp: new Date(),
            ...data,
        });
    }
    emitBannerDeleted(bannerId) {
        this.realtimeGateway.emitToChannel('banners', 'banner:deleted', {
            bannerId,
            timestamp: new Date(),
        });
    }
    emitBrandUpdate(data) {
        this.realtimeGateway.emitToChannel('brands', 'brand:updated', {
            timestamp: new Date(),
            ...data,
        });
    }
    emitBrandCreated(data) {
        this.realtimeGateway.emitToChannel('brands', 'brand:created', {
            timestamp: new Date(),
            ...data,
        });
    }
    emitBrandDeleted(brandId) {
        this.realtimeGateway.emitToChannel('brands', 'brand:deleted', {
            brandId,
            timestamp: new Date(),
        });
    }
    emitFlashDealUpdate(data) {
        this.realtimeGateway.emitToChannel('flash-deals', 'flashdeal:updated', {
            timestamp: new Date(),
            ...data,
        });
    }
    emitFlashDealCreated(data) {
        this.realtimeGateway.emitToChannel('flash-deals', 'flashdeal:created', {
            timestamp: new Date(),
            ...data,
        });
    }
    emitFlashDealDeleted(dealId) {
        this.realtimeGateway.emitToChannel('flash-deals', 'flashdeal:deleted', {
            dealId,
            timestamp: new Date(),
        });
    }
    emitCategoryUpdate(data) {
        this.realtimeGateway.emitToChannel('categories', 'category:updated', {
            timestamp: new Date(),
            ...data,
        });
    }
    emitCategoryCreated(data) {
        this.realtimeGateway.emitToChannel('categories', 'category:created', {
            timestamp: new Date(),
            ...data,
        });
    }
    emitCategoryDeleted(categoryId) {
        this.realtimeGateway.emitToChannel('categories', 'category:deleted', {
            categoryId,
            timestamp: new Date(),
        });
    }
    emitOrderUpdate(data) {
        this.realtimeGateway.emitToChannel('orders', 'order:updated', {
            timestamp: new Date(),
            ...data,
        });
    }
    emitOrderstatusUpdate(orderId, status) {
        this.realtimeGateway.emitToChannel('orders', 'order:status-changed', {
            orderId,
            status,
            timestamp: new Date(),
        });
    }
    emitHomePageUpdate(data) {
        this.realtimeGateway.broadcastEvent('homepage:update', {
            timestamp: new Date(),
            ...data,
        });
    }
};
exports.RealtimeService = RealtimeService;
exports.RealtimeService = RealtimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [realtime_gateway_1.RealtimeGateway])
], RealtimeService);
//# sourceMappingURL=realtime.service.js.map