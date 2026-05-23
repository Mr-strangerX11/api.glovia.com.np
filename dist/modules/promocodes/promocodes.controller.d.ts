import { PromoCodesService } from './promocodes.service';
import { CreatePromoCodeDto } from './dto/create-promocode.dto';
import { UpdatePromoCodeDto } from './dto/update-promocode.dto';
export declare class PromoCodesController {
    private promoCodesService;
    constructor(promoCodesService: PromoCodesService);
    findAllForAdmin(): Promise<(import("../../database/schemas").Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findAll(): Promise<(import("../../database/schemas").Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findByCode(code: string): Promise<import("../../database/schemas").Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    create(dto: CreatePromoCodeDto): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas").Coupon, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas").Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: UpdatePromoCodeDto): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas").Coupon, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas").Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas").Coupon, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas").Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
