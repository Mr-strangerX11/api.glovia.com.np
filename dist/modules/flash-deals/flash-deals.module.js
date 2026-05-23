"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashDealsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const flash_deals_service_1 = require("./flash-deals.service");
const flash_deals_controller_1 = require("./flash-deals.controller");
const flash_deal_schema_1 = require("../../database/schemas/flash-deal.schema");
const realtime_module_1 = require("../realtime/realtime.module");
let FlashDealsModule = class FlashDealsModule {
};
exports.FlashDealsModule = FlashDealsModule;
exports.FlashDealsModule = FlashDealsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'FlashDeal', schema: flash_deal_schema_1.FlashDealSchema }]),
            realtime_module_1.RealtimeModule,
        ],
        controllers: [flash_deals_controller_1.FlashDealsController],
        providers: [flash_deals_service_1.FlashDealsService],
        exports: [flash_deals_service_1.FlashDealsService],
    })
], FlashDealsModule);
//# sourceMappingURL=flash-deals.module.js.map