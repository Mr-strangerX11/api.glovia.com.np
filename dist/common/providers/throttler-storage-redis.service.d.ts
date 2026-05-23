import { ThrottlerStorage } from '@nestjs/throttler';
export interface ThrottlerRedisOptions {
    url: string;
}
export declare class ThrottlerStorageRedisService implements ThrottlerStorage {
    private redis;
    constructor(options: ThrottlerRedisOptions);
    private counterKey;
    private blockKey;
    increment(key: string, ttl: number, limit: number, blockDuration: number, throttlerName: string): Promise<any>;
}
