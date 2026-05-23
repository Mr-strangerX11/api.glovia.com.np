import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    initiateEsewa(orderId: string): Promise<{
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
    verifyEsewa(data: {
        oid: string;
        amt: string;
        refId: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    initiateKhalti(orderId: string): Promise<{
        publicKey: any;
        amount: number;
        productIdentity: string;
        productName: string;
        productUrl: string;
    }>;
    verifyKhalti(data: {
        token: string;
        amount: number;
        orderId: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    initiateIME(orderId: string): Promise<{
        paymentUrl: string;
        paymentData: {
            MerchantCode: any;
            Amount: string;
            RefId: string;
            TokenId: string;
        };
    }>;
    verifyIME(data: {
        TransactionId: string;
        RefId: string;
        Msisdn: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
