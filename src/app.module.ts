import { AuditLogModule } from './modules/auditlog/auditlog.module';
import { FlashDealsModule } from './modules/flash-deals/flash-deals.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/prisma.module';
import { FirebaseModule } from './common/modules/firebase.module';
import { EmailNotificationModule } from './common/services/email-notification.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './modules/health/health.module';
import { CartModule } from './modules/cart/cart.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { BannersModule } from './modules/banners/banners.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { UploadModule } from './modules/upload/upload.module';
import { VerificationModule } from './modules/verification/verification.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { BrandsModule } from './modules/brands/brands.module';
import { PromoCodesModule } from './modules/promocodes/promocodes.module';
import { PopupsModule } from './modules/popups/popups.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AiModule } from './modules/ai/ai.module';
import { LoyaltyModule } from './modules/loyalty/loyalty.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { RealtimeModule } from './modules/realtime/realtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Load local .env only in non-production to avoid committing secrets
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : '.env',
    }),
    // Throttler expects ttl in seconds (not milliseconds). Use env overrides when provided.
    ThrottlerModule.forRoot(
      (() => {
        const ttl = parseInt(process.env.RATE_TTL || '60', 10);
        const limit = parseInt(process.env.RATE_LIMIT || '100', 10);
        const redisUrl = process.env.THROTTLE_REDIS_URL;
        if (redisUrl) {
          try {
            // Use local Redis-backed storage implementation
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const {
              ThrottlerStorageRedisService,
            } = require('./common/providers/throttler-storage-redis.service');
            return {
              ttl,
              limit,
              storage: new ThrottlerStorageRedisService({ url: redisUrl }),
            } as unknown as any;
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(
              'Failed to initialize Redis throttler storage, falling back to in-memory throttler',
              e && e.message
            );
            return { ttl, limit } as unknown as any;
          }
        }
        return { ttl, limit } as unknown as any;
      })()
    ),
    EmailNotificationModule,
    DatabaseModule,
    FirebaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    OrdersModule,
    PromoCodesModule,
    PopupsModule,
    AuditLogModule,
    PaymentsModule,
    AdminModule,
    CartModule,
    WishlistModule,
    ReviewsModule,
    BannersModule,
    BlogsModule,
    UploadModule,
    VerificationModule,
    VendorsModule,
    HealthModule,
    AnalyticsModule,
    AiModule,
    LoyaltyModule,
    WalletModule,
    SubscriptionsModule,
    FlashDealsModule,
    RealtimeModule,
  ],
})
export class AppModule {}
