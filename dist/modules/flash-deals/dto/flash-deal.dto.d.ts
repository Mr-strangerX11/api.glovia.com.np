export declare class FlashDealProductDto {
    productId: string;
    productName: string;
    productImage?: string;
    originalPrice: number;
    salePrice: number;
    discountPercentage?: number;
}
export declare class CreateFlashDealDto {
    title: string;
    description?: string;
    products: FlashDealProductDto[];
    startTime: Date;
    endTime: Date;
    adImage: string;
    displayOrder?: number;
}
export declare class UpdateFlashDealDto {
    title?: string;
    description?: string;
    products?: FlashDealProductDto[];
    startTime?: Date;
    endTime?: Date;
    adImage?: string;
    isActive?: boolean;
    displayOrder?: number;
}
