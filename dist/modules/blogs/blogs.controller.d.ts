import { BlogsService } from './blogs.service';
export declare class BlogsController {
    private blogsService;
    constructor(blogsService: BlogsService);
    findAll(page?: string, limit?: string): Promise<{
        data: (import("../../database/schemas").Blog & Required<{
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
    findBySlug(slug: string): Promise<import("../../database/schemas").Blog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
