export declare class CreatePromoCodeDto {
    code: string;
    discount: number;
    expiresAt?: string;
    usageLimit?: number;
    active?: boolean;
    metadata?: Record<string, any>;
}
