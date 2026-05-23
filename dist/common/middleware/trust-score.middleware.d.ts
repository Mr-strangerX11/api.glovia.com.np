import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { User } from '../../database/schemas/user.schema';
export declare class TrustScoreMiddleware implements NestMiddleware {
    private userModel;
    constructor(userModel: Model<User>);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
