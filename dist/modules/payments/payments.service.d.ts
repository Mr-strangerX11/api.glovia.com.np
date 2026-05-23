import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Payment, Order } from '../../database/schemas';
export declare class PaymentsService {
    private paymentModel;
    private orderModel;
    private configService;
    constructor(paymentModel: Model<Payment>, orderModel: Model<Order>, configService: ConfigService);
    initiateEsewaPayment(orderId: string): Promise<{
        paymentUrl: any;
        paymentData: {
            amt: string;
            psc: string;
            pdc: string;
            txAmt: string;
            tAmt: string;
            pid: string;
            scd: any;
            su: any;
            fu: any;
        };
    }>;
    verifyEsewaPayment(data: {
        oid: string;
        amt: string;
        refId: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    initiateKhaltiPayment(orderId: string): Promise<{
        publicKey: any;
        amount: number;
        productIdentity: string;
        productName: string;
        productUrl: string;
    }>;
    verifyKhaltiPayment(data: {
        token: string;
        amount: number;
        orderId: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    initiateIMEPayment(orderId: string): Promise<{
        paymentUrl: string;
        paymentData: {
            MerchantCode: any;
            Amount: string;
            RefId: string;
            TokenId: string;
        };
    }>;
    verifyIMEPayment(data: {
        TransactionId: string;
        RefId: string;
        Msisdn: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateIMEToken;
}
