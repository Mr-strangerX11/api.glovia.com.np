import { FlashDealsService } from './flash-deals.service';
import { CreateFlashDealDto, UpdateFlashDealDto } from './dto/flash-deal.dto';
export declare class FlashDealsController {
    private readonly flashDealsService;
    constructor(flashDealsService: FlashDealsService);
    getStatistics(): Promise<{
        success: boolean;
        data: {
            active: number;
            upcoming: number;
            expired: number;
            total: number;
            totalViews: any;
            totalClicks: any;
        };
    }>;
    getActiveFlashDeals(): Promise<{
        success: boolean;
        data: (import("../../database/schemas").FlashDeal & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getAllFlashDeals(page?: string, limit?: string): Promise<{
        data: (import("../../database/schemas").FlashDeal & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
        success: boolean;
    }>;
    getFlashDealById(id: string): Promise<{
        success: boolean;
        data: import("../../database/schemas").FlashDeal & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    createFlashDeal(dto: CreateFlashDealDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../database/schemas").FlashDeal, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas").FlashDeal & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updateFlashDeal(id: string, dto: UpdateFlashDealDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../database/schemas").FlashDeal, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas").FlashDeal & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    deleteFlashDeal(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleFlashDeal(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../database/schemas").FlashDeal, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas").FlashDeal & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    reorderFlashDeals(deals: Array<{
        id: string;
        order: number;
    }>): Promise<{
        success: boolean;
        message: string;
    }>;
    recordView(id: string): Promise<{
        success: boolean;
    }>;
    recordClick(id: string): Promise<{
        success: boolean;
    }>;
}
