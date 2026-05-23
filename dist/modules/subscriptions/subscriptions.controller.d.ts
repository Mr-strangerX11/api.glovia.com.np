import { SubscriptionsService } from './subscriptions.service';
import { Response } from 'express';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    subscribe(body: {
        email: string;
        source?: string;
    }): Promise<{
        message: string;
        alreadySubscribed: boolean;
        promoCode?: string;
    }>;
    unsubscribe(email: string): Promise<{
        message: string;
    }>;
    exportSubscribersToExcel(res: Response): Promise<void>;
    getAllSubscribers(limit?: string, skip?: string): Promise<{
        subscribers: (import("../../database/schemas").NewsletterSubscriber & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        limit: number;
        skip: number;
    }>;
}
