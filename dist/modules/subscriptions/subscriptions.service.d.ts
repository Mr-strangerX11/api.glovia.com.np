import { Model } from 'mongoose';
import { NewsletterSubscriber } from '../../database/schemas/newsletter.schema';
import { EmailNotificationService } from '../../common/services/email-notification.service';
export declare class SubscriptionsService {
    private readonly subscriberModel;
    private readonly emailService;
    constructor(subscriberModel: Model<NewsletterSubscriber>, emailService: EmailNotificationService);
    subscribe(email: string, source?: string): Promise<{
        message: string;
        alreadySubscribed: boolean;
        promoCode?: string;
    }>;
    unsubscribe(email: string): Promise<{
        message: string;
    }>;
    getAllSubscribers(limit?: number, skip?: number): Promise<(NewsletterSubscriber & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getSubscriberCount(): Promise<number>;
    exportSubscribersToExcel(): Promise<Buffer>;
}
