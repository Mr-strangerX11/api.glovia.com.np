import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private sentry;
    catch(exception: unknown, host: ArgumentsHost): void;
}
