import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Connection } from 'mongoose';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private connection;
    constructor(connection: Connection);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    cleanDatabase(): Promise<import("mongodb").DeleteResult[]>;
}
