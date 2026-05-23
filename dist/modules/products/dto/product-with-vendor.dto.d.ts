export declare class CreateProductDto {
    name: string;
    description: string;
    ingredients?: string;
    benefits?: string;
    howToUse?: string;
    price: number;
    compareAtPrice?: number;
    discountPercentage?: number;
    costPrice?: number;
    sku: string;
    barcode?: string;
    stockQuantity: number;
    categoryId: string;
    brandId?: string;
    suitableFor?: string[];
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];
}
export declare class CreateProductAsAdminDto extends CreateProductDto {
    vendorId: string;
    vendorName?: string;
    vendorEmail?: string;
    vendorPhone?: string;
}
export declare class BulkProductUploadDto {
    vendorId?: string;
}
export declare class BulkUploadResult {
    successCount: number;
    failedCount: number;
    failedRows: {
        row: number;
        reason: string;
    }[];
}
