"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const schemas = require("./schemas");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const uri = configService.get('DATABASE_URL') || process.env.DATABASE_URL;
                    if (!uri) {
                        throw new Error('DATABASE_URL is not set. Add it to Backend/.env (local dev) or the cPanel environment variables (production).\n' +
                            'Example: DATABASE_URL=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/glovia?retryWrites=true&w=majority');
                    }
                    return {
                        uri,
                        retryAttempts: 3,
                        retryDelay: 1000,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: 'User', schema: schemas.UserSchema },
                { name: 'Address', schema: schemas.AddressSchema },
                { name: 'Category', schema: schemas.CategorySchema },
                { name: 'Brand', schema: schemas.BrandSchema },
                { name: 'Product', schema: schemas.ProductSchema },
                { name: 'ProductImage', schema: schemas.ProductImageSchema },
                { name: 'CartItem', schema: schemas.CartItemSchema },
                { name: 'WishlistItem', schema: schemas.WishlistItemSchema },
                { name: 'Order', schema: schemas.OrderSchema },
                { name: 'OrderItem', schema: schemas.OrderItemSchema },
                { name: 'Payment', schema: schemas.PaymentSchema },
                { name: 'Review', schema: schemas.ReviewSchema },
                { name: 'Coupon', schema: schemas.CouponSchema },
                { name: 'Banner', schema: schemas.BannerSchema },
                { name: 'Blog', schema: schemas.BlogSchema },
                { name: 'OtpVerification', schema: schemas.OtpVerificationSchema },
                { name: 'Setting', schema: schemas.SettingSchema },
            ]),
        ],
        exports: [mongoose_1.MongooseModule],
    })
], DatabaseModule);
//# sourceMappingURL=prisma.module.js.map