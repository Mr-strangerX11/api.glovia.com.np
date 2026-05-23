import { OrderStatus } from '../../../database/schemas/order.schema';
export declare class UpdateOrderDto {
    status?: OrderStatus;
    trackingNumber?: string;
    deliveryPartner?: string;
    adminNote?: string;
    discount?: number;
    deliveryCharge?: number;
}
