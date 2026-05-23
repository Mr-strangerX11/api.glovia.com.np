import { Model, Types } from 'mongoose';
import { FlashDeal } from '../../database/schemas';
import { CreateFlashDealDto, UpdateFlashDealDto } from './dto/flash-deal.dto';
import { RealtimeService } from '../realtime/realtime.service';
export declare class FlashDealsService {
    private flashDealModel;
    private realtimeService;
    constructor(flashDealModel: Model<FlashDeal>, realtimeService: RealtimeService);
    getActiveFlashDeals(): Promise<(FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getAllFlashDeals(page?: number, limit?: number): Promise<{
        data: (FlashDeal & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getFlashDealById(id: string): Promise<FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createFlashDeal(dto: CreateFlashDealDto, adminId: string): Promise<import("mongoose").Document<unknown, {}, FlashDeal, {}, import("mongoose").DefaultSchemaOptions> & FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateFlashDeal(id: string, dto: UpdateFlashDealDto, adminId: string): Promise<import("mongoose").Document<unknown, {}, FlashDeal, {}, import("mongoose").DefaultSchemaOptions> & FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteFlashDeal(id: string): Promise<{
        message: string;
    }>;
    reorderFlashDeals(deals: Array<{
        id: string;
        order: number;
    }>): Promise<{
        message: string;
    }>;
    toggleFlashDeal(id: string): Promise<import("mongoose").Document<unknown, {}, FlashDeal, {}, import("mongoose").DefaultSchemaOptions> & FlashDeal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    recordView(id: string): Promise<void>;
    recordClick(id: string): Promise<void>;
    getStatistics(): Promise<{
        active: number;
        upcoming: number;
        expired: number;
        total: number;
        totalViews: any;
        totalClicks: any;
    }>;
}
