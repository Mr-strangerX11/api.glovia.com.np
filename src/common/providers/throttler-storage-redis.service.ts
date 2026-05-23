import { ThrottlerStorage } from '@nestjs/throttler';
import Redis from 'ioredis';

export interface ThrottlerRedisOptions {
  url: string;
}

export class ThrottlerStorageRedisService implements ThrottlerStorage {
  private redis: any;

  constructor(options: ThrottlerRedisOptions) {
    this.redis = new Redis(options.url);
  }

  private counterKey(throttlerName: string, key: string) {
    return `throttle:${throttlerName}:${key}`;
  }

  private blockKey(throttlerName: string, key: string) {
    return `throttle:block:${throttlerName}:${key}`;
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string
  ): Promise<any> {
    const counter = this.counterKey(throttlerName, key);
    const block = this.blockKey(throttlerName, key);

    // Check if blocked
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

    // Increment counter and set TTL if new
    const totalHits = await this.redis.incr(counter);
    if (totalHits === 1) {
      await this.redis.expire(counter, ttl);
    }

    const timeToExpire = await this.redis.ttl(counter);

    // If exceeded limit, set block key
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
