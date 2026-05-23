interface OrderEmailItem {
    name: string;
    quantity: number;
    price: number;
    total: number;
}
interface OrderEmailAddress {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    municipality: string;
    wardNo: number;
    area: string;
    landmark?: string;
}
interface OrderEmailPayload {
    orderNumber: string;
    total: number;
    subtotal: number;
    discount: number;
    deliveryCharge: number;
    paymentMethod: string;
    customerName: string;
    customerEmail: string;
    items: OrderEmailItem[];
    address: OrderEmailAddress;
}
interface OrderStatusEmailPayload {
    orderNumber: string;
    status: string;
    customerName: string;
    customerEmail: string;
    trackingNumber?: string;
    deliveryPartner?: string;
    updatedAt?: Date;
}
interface VendorOrderItem {
    name: string;
    quantity: number;
    price: number;
    total: number;
}
interface VendorOrderEmailPayload {
    orderNumber: string;
    vendorName: string;
    vendorEmail: string;
    customerName: string;
    customerPhone: string;
    items: VendorOrderItem[];
    subtotal: number;
}
export declare class EmailNotificationService {
    private readonly logger;
    private readonly provider;
    private transporter;
    constructor();
    sendOrderConfirmedEmail(payload: OrderEmailPayload, adminEmail?: string): Promise<void>;
    sendOrderStatusChangedEmail(payload: OrderStatusEmailPayload): Promise<void>;
    private buildOrderConfirmedHtml;
    private buildOrderStatusChangedHtml;
    sendVendorOrderEmailAsync(payload: VendorOrderEmailPayload): Promise<void>;
    private buildVendorOrderHtml;
    sendNewsletterSubscriptionEmail(customerEmail: string, customerName?: string): Promise<void>;
    private buildNewsletterSubscriptionHtml;
    sendVerificationEmail(customerEmail: string, customerName: string, userId: string): Promise<void>;
    private buildVerificationEmailHtml;
    sendVendorOrderNotificationEmail(vendorEmail: string, vendorName: string, orderData: {
        orderId: string;
        orderNumber: string;
        orderDate: Date;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        items: any[];
        vendorTotal: number;
        paymentMethod: string;
    }): Promise<void>;
    private buildVendorOrderNotificationHtml;
}
export {};
