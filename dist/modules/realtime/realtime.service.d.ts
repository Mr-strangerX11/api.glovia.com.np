import { RealtimeGateway } from './realtime.gateway';
export declare class RealtimeService {
    private realtimeGateway;
    constructor(realtimeGateway: RealtimeGateway);
    emitProductUpdate(data: any): void;
    emitProductCreated(data: any): void;
    emitProductDeleted(productId: string): void;
    emitBannerUpdate(data: any): void;
    emitBannerCreated(data: any): void;
    emitBannerDeleted(bannerId: string): void;
    emitBrandUpdate(data: any): void;
    emitBrandCreated(data: any): void;
    emitBrandDeleted(brandId: string): void;
    emitFlashDealUpdate(data: any): void;
    emitFlashDealCreated(data: any): void;
    emitFlashDealDeleted(dealId: string): void;
    emitCategoryUpdate(data: any): void;
    emitCategoryCreated(data: any): void;
    emitCategoryDeleted(categoryId: string): void;
    emitOrderUpdate(data: any): void;
    emitOrderstatusUpdate(orderId: string, status: string): void;
    emitHomePageUpdate(data: any): void;
}
