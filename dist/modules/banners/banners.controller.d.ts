import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
export declare class BannersController {
    private bannersService;
    constructor(bannersService: BannersService);
    findAll(): Promise<(import("../../database/schemas").Banner & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findAllForAdmin(): Promise<(import("../../database/schemas").Banner & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("../../database/schemas").Banner & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    create(createBannerDto: CreateBannerDto): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas").Banner, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas").Banner & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updateBannerDto: UpdateBannerDto): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas").Banner, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas").Banner & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
