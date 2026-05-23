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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const email_notification_service_1 = require("../../common/services/email-notification.service");
const exceljs_1 = require("exceljs");
let SubscriptionsService = class SubscriptionsService {
    constructor(subscriberModel, emailService) {
        this.subscriberModel = subscriberModel;
        this.emailService = emailService;
    }
    async subscribe(email, source) {
        const normalizedEmail = email.toLowerCase().trim();
        if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            throw new common_1.BadRequestException('Invalid email address');
        }
        const existing = await this.subscriberModel.findOne({ email: normalizedEmail });
        if (existing) {
            if (existing.isActive) {
                return { message: 'You are already subscribed!', alreadySubscribed: true };
            }
            existing.isActive = true;
            await existing.save();
            await this.emailService.sendNewsletterSubscriptionEmail(normalizedEmail);
            return {
                message: 'Welcome back! You have been re-subscribed.',
                alreadySubscribed: false,
                promoCode: 'SUB-GLOVIA',
            };
        }
        await this.subscriberModel.create({ email: normalizedEmail, source: source || 'homepage' });
        try {
            await this.emailService.sendNewsletterSubscriptionEmail(normalizedEmail);
        }
        catch (error) {
            console.error('Failed to send newsletter subscription email:', error);
        }
        return {
            message: 'Successfully subscribed! Thank you for joining Glovia.',
            alreadySubscribed: false,
            promoCode: 'SUB-GLOVIA',
        };
    }
    async unsubscribe(email) {
        const normalizedEmail = email.toLowerCase().trim();
        await this.subscriberModel.findOneAndUpdate({ email: normalizedEmail }, { isActive: false });
        return { message: 'You have been unsubscribed.' };
    }
    async getAllSubscribers(limit, skip) {
        const query = this.subscriberModel.find({ isActive: true }).sort({ createdAt: -1 });
        if (skip)
            query.skip(skip);
        if (limit)
            query.limit(limit);
        return query.lean();
    }
    async getSubscriberCount() {
        return this.subscriberModel.countDocuments({ isActive: true });
    }
    async exportSubscribersToExcel() {
        const subscribers = await this.subscriberModel
            .find({ isActive: true })
            .sort({ createdAt: -1 })
            .lean();
        const data = subscribers.map((sub, index) => ({
            '#': index + 1,
            Email: sub.email,
            Source: sub.source || 'homepage',
            'Subscribed Date': new Date(sub.createdAt).toLocaleDateString('en-US'),
            'Subscribed Time': new Date(sub.createdAt).toLocaleTimeString('en-US'),
            Status: sub.isActive ? 'Active' : 'Inactive',
        }));
        const summary = [
            {
                '#': 'GLOVIA NEWSLETTER SUBSCRIBERS REPORT',
                Email: '',
                Source: '',
                'Subscribed Date': '',
                'Subscribed Time': '',
                Status: '',
            },
            {
                '#': `Generated on: ${new Date().toLocaleString()}`,
                Email: '',
                Source: '',
                'Subscribed Date': '',
                'Subscribed Time': '',
                Status: '',
            },
            {
                '#': `Total Subscribers: ${subscribers.length}`,
                Email: '',
                Source: '',
                'Subscribed Date': '',
                'Subscribed Time': '',
                Status: '',
            },
            { '#': '', Email: '', Source: '', 'Subscribed Date': '', 'Subscribed Time': '', Status: '' },
            ...data,
        ];
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet('Subscribers');
        worksheet.columns = [
            { header: '#', key: 'index', width: 5 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Source', key: 'source', width: 15 },
            { header: 'Subscribed Date', key: 'date', width: 15 },
            { header: 'Subscribed Time', key: 'time', width: 15 },
            { header: 'Status', key: 'status', width: 12 },
        ];
        for (const row of summary) {
            worksheet.addRow({
                index: row['#'],
                email: row['Email'],
                source: row['Source'],
                date: row['Subscribed Date'],
                time: row['Subscribed Time'],
                status: row['Status'],
            });
        }
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber <= 3) {
                row.font = { bold: true };
            }
        });
        const ab = await workbook.xlsx.writeBuffer();
        return Buffer.from(ab);
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('NewsletterSubscriber')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_notification_service_1.EmailNotificationService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map