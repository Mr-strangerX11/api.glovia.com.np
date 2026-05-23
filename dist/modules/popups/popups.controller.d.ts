import { PopupsService } from './popups.service';
import { CreatePopupDto } from './dto/create-popup.dto';
import { UpdatePopupDto } from './dto/update-popup.dto';
export declare class PopupsController {
    private popupsService;
    constructor(popupsService: PopupsService);
    findAll(): Promise<(import("./popups.schema").Popup & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findActive(): Promise<(import("./popups.schema").Popup & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    create(dto: CreatePopupDto): Promise<import("mongoose").Document<unknown, {}, import("./popups.schema").Popup, {}, import("mongoose").DefaultSchemaOptions> & import("./popups.schema").Popup & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: UpdatePopupDto): Promise<import("mongoose").Document<unknown, {}, import("./popups.schema").Popup, {}, import("mongoose").DefaultSchemaOptions> & import("./popups.schema").Popup & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("./popups.schema").Popup, {}, import("mongoose").DefaultSchemaOptions> & import("./popups.schema").Popup & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
