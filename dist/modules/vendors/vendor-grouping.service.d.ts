export declare class VendorGroupingService {
    groupOrdersByVendor(orderItems: any[]): Record<string, any>;
    getUniqueVendors(orderItems: any[]): any[];
    filterItemsByVendor(orderItems: any[], vendorId: string): any[];
    calculateVendorTotal(items: any[]): any;
}
