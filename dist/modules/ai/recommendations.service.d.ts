import { Model, Types, Document } from 'mongoose';
import { Product, ProductDocument } from '../../database/schemas/product.schema';
import { ProductImage } from '../../database/schemas/product-image.schema';
type ProductLean = Omit<Product, keyof Document> & {
    _id: string | Types.ObjectId;
    categoryId: string | Types.ObjectId;
    isActive: boolean;
    isBestSeller?: boolean;
};
export declare class RecommendationsService {
    private productModel;
    private productImageModel;
    constructor(productModel: Model<ProductDocument>, productImageModel: Model<Document & ProductImage>);
    getRecommendations(userId?: string, productId?: string): Promise<ProductLean[]>;
}
export {};
