import * as Sentry from '@sentry/node';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SentryService {
  init() {
    const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn) return;
    Sentry.init({
      dsn,
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    });
  }

  captureException(err: any) {
    if (!process.env.SENTRY_DSN) return;
    try {
      Sentry.captureException(err);
    } catch (e) {
      // ignore
    }
  }

  captureMessage(msg: string) {
    if (!process.env.SENTRY_DSN) return;
    try {
      Sentry.captureMessage(msg);
    } catch (e) {
      // ignore
    }
  }
}
