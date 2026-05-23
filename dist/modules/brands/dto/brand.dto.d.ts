export declare class CreateBrandDto {
    name: string;
    slug?: string;
    description?: string;
    logo?: string;
}
export declare class UpdateBrandDto {
    name?: string;
    slug?: string;
    description?: string;
    logo?: string;
    isActive?: boolean;
    isFeatured?: boolean;
}
