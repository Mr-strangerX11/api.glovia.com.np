"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrottlerStorageRedisService = void 0;
const ioredis_1 = require("ioredis");
class ThrottlerStorageRedisService {
    constructor(options) {
        this.redis = new ioredis_1.default(options.url);
    }
    counterKey(throttlerName, key) {
        return `throttle:${throttlerName}:${key}`;
    }
    blockKey(throttlerName, key) {
        return `throttle:block:${throttlerName}:${key}`;
    }
    async increment(key, ttl, limit, blockDuration, throttlerName) {
        const counter = this.counterKey(throttlerName, key);
        const block = this.blockKey(throttlerName, key);
        const isBlocked = (await this.redis.exists(block)) === 1;
        if (isBlocked) {
            const timeToBlockExpire = await this.redis.ttl(block);
            const timeToExpire = await this.redis.ttl(counter);
            return {
                totalHits: 0,
                timeToExpire: timeToExpire > 0 ? timeToExpire : 0,
                isBlocked: true,
                timeToBlockExpire: timeToBlockExpire > 0 ? timeToBlockExpire : 0,
            };
        }
        const totalHits = await this.redis.incr(counter);
        if (totalHits === 1) {
            await this.redis.expire(counter, ttl);
        }
        const timeToExpire = await this.redis.ttl(counter);
        if (totalHits > limit) {
            await this.redis.set(block, '1', 'EX', blockDuration);
            return {
                totalHits,
                timeToExpire: timeToExpire > 0 ? timeToExpire : 0,
                isBlocked: true,
                timeToBlockExpire: blockDuration,
            };
        }
        return {
            totalHits,
            timeToExpire: timeToExpire > 0 ? timeToExpire : 0,
            isBlocked: false,
            timeToBlockExpire: 0,
        };
    }
}
exports.ThrottlerStorageRedisService = ThrottlerStorageRedisService;
//# sourceMappingURL=throttler-storage-redis.service.js.map