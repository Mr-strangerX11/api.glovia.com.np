"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schemas_1 = require("../../database/schemas");
const crypto = require("crypto");
const axios_1 = require("axios");
let PaymentsService = class PaymentsService {
    constructor(paymentModel, orderModel, configService) {
        this.paymentModel = paymentModel;
        this.orderModel = orderModel;
        this.configService = configService;
    }
    async initiateEsewaPayment(orderId) {
        const order = await this.orderModel.findById(orderId).lean();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.paymentMethod !== schemas_1.PaymentMethod.ESEWA) {
            throw new common_1.BadRequestException('Invalid payment method for this order');
        }
        const esewaConfig = {
            amt: order.total.toString(),
            psc: '0',
            pdc: '0',
            txAmt: '0',
            tAmt: order.total.toString(),
            pid: order.orderNumber,
            scd: this.configService.get('ESEWA_MERCHANT_ID'),
            su: this.configService.get('ESEWA_SUCCESS_URL'),
            fu: this.configService.get('ESEWA_FAILURE_URL'),
        };
        return {
            paymentUrl: this.configService.get('ESEWA_GATEWAY_URL'),
            paymentData: esewaConfig,
        };
    }
    async verifyEsewaPayment(data) {
        const order = await this.orderModel.findOne({ orderNumber: data.oid }).lean();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const verificationUrl = `${this.configService.get('ESEWA_GATEWAY_URL')}/epay/transrec`;
        try {
            const response = await axios_1.default.post(verificationUrl, {
                amt: data.amt,
                rid: data.refId,
                pid: data.oid,
                scd: this.configService.get('ESEWA_MERCHANT_ID'),
            });
            if (response.data.includes('Success')) {
                await this.paymentModel.findOneAndUpdate({ orderId: new mongoose_2.Types.ObjectId(order._id) }, {
                    status: schemas_1.PaymentStatus.COMPLETED,
                    transactionId: data.refId,
                    paidAt: new Date(),
                    gatewayResponse: data,
                }, { new: true });
                await this.orderModel.findByIdAndUpdate(order._id, {
                    paymentStatus: schemas_1.PaymentStatus.COMPLETED,
                    status: schemas_1.OrderStatus.CONFIRMED,
                    confirmedAt: new Date(),
                });
                return { success: true, message: 'Payment verified successfully' };
            }
            throw new common_1.BadRequestException('Payment verification failed');
        }
        catch (error) {
            throw new common_1.BadRequestException('Payment verification failed');
        }
    }
    async initiateKhaltiPayment(orderId) {
        const order = await this.orderModel.findById(orderId).lean();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.paymentMethod !== schemas_1.PaymentMethod.KHALTI) {
            throw new common_1.BadRequestException('Invalid payment method for this order');
        }
        const khaltiConfig = {
            publicKey: this.configService.get('KHALTI_PUBLIC_KEY'),
            amount: Number(order.total) * 100,
            productIdentity: order.orderNumber,
            productName: `Order #${order.orderNumber}`,
            productUrl: `${this.configService.get('FRONTEND_URL')}/orders/${order._id}`,
        };
        return khaltiConfig;
    }
    async verifyKhaltiPayment(data) {
        const order = await this.orderModel.findById(data.orderId).lean();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        try {
            const response = await axios_1.default.post(this.configService.get('KHALTI_GATEWAY_URL'), {
                token: data.token,
                amount: data.amount,
            }, {
                headers: {
                    Authorization: `Key ${this.configService.get('KHALTI_SECRET_KEY')}`,
                },
            });
            if (response.data.state?.name === 'Completed') {
                await this.paymentModel.findOneAndUpdate({ orderId: new mongoose_2.Types.ObjectId(order._id) }, {
                    status: schemas_1.PaymentStatus.COMPLETED,
                    transactionId: response.data.idx,
                    paidAt: new Date(),
                    gatewayResponse: response.data,
                }, { new: true });
                await this.orderModel.findByIdAndUpdate(order._id, {
                    paymentStatus: schemas_1.PaymentStatus.COMPLETED,
                    status: schemas_1.OrderStatus.CONFIRMED,
                    confirmedAt: new Date(),
                });
                return { success: true, message: 'Payment verified successfully' };
            }
            throw new common_1.BadRequestException('Payment verification failed');
        }
        catch (error) {
            throw new common_1.BadRequestException('Payment verification failed');
        }
    }
    async initiateIMEPayment(orderId) {
        const order = await this.orderModel.findById(orderId).lean();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.paymentMethod !== schemas_1.PaymentMethod.IME_PAY) {
            throw new common_1.BadRequestException('Invalid payment method for this order');
        }
        const tokenId = this.generateIMEToken();
        const merchantCode = this.configService.get('IME_MERCHANT_CODE');
        const amount = order.total.toString();
        const requestData = {
            MerchantCode: merchantCode,
            Amount: amount,
            RefId: order.orderNumber,
            TokenId: tokenId,
        };
        return {
            paymentUrl: `${this.configService.get('IME_GATEWAY_URL')}/Checkout`,
            paymentData: requestData,
        };
    }
    async verifyIMEPayment(data) {
        const order = await this.orderModel.findOne({ orderNumber: data.RefId }).lean();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        try {
            const response = await axios_1.default.post(`${this.configService.get('IME_GATEWAY_URL')}/Validate`, {
                TransactionId: data.TransactionId,
                MerchantCode: this.configService.get('IME_MERCHANT_CODE'),
            });
            if (response.data.ResponseCode === '0') {
                await this.paymentModel.findOneAndUpdate({ orderId: new mongoose_2.Types.ObjectId(order._id) }, {
                    status: schemas_1.PaymentStatus.COMPLETED,
                    transactionId: data.TransactionId,
                    paidAt: new Date(),
                    gatewayResponse: data,
                }, { new: true });
                await this.orderModel.findByIdAndUpdate(order._id, {
                    paymentStatus: schemas_1.PaymentStatus.COMPLETED,
                    status: schemas_1.OrderStatus.CONFIRMED,
                    confirmedAt: new Date(),
                });
                return { success: true, message: 'Payment verified successfully' };
            }
            throw new common_1.BadRequestException('Payment verification failed');
        }
        catch (error) {
            throw new common_1.BadRequestException('Payment verification failed');
        }
    }
    generateIMEToken() {
        return crypto.randomBytes(16).toString('hex');
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Payment')),
    __param(1, (0, mongoose_1.InjectModel)('Order')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map