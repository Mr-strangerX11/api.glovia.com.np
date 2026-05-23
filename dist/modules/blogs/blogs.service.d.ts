import { Model } from 'mongoose';
import { Blog } from '../../database/schemas/blog.schema';
export declare class BlogsService {
    private blogModel;
    constructor(blogModel: Model<Blog>);
    findAll(page?: number, limit?: number): Promise<{
        data: (Blog & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<Blog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
