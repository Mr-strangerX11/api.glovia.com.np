"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryService = void 0;
const Sentry = require("@sentry/node");
const common_1 = require("@nestjs/common");
let SentryService = class SentryService {
    init() {
        const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
        if (!dsn)
            return;
        Sentry.init({
            dsn,
            tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
        });
    }
    captureException(err) {
        if (!process.env.SENTRY_DSN)
            return;
        try {
            Sentry.captureException(err);
        }
        catch (e) {
        }
    }
    captureMessage(msg) {
        if (!process.env.SENTRY_DSN)
            return;
        try {
            Sentry.captureMessage(msg);
        }
        catch (e) {
        }
    }
};
exports.SentryService = SentryService;
exports.SentryService = SentryService = __decorate([
    (0, common_1.Injectable)()
], SentryService);
//# sourceMappingURL=sentry.service.js.map