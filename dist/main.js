"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const compression = require("compression");
const helmet_1 = require("helmet");
const cookieParser = require("cookie-parser");
const csrf_middleware_1 = require("./common/middleware/csrf.middleware");
const express_1 = require("express");
const app_module_1 = require("./app.module");
function validateProductionEnv() {
    if (process.env.NODE_ENV !== 'production')
        return;
    const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'FRONTEND_URL'];
    if (process.env.EMAIL_PROVIDER === 'smtp') {
        required.push('SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD');
    }
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length) {
        console.error('FATAL: Missing required environment variables:', missing.join(', '));
        process.exit(1);
    }
    const frontendUrls = (process.env.FRONTEND_URL || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    if (!frontendUrls.length) {
        console.error('FATAL: FRONTEND_URL must be set in production (e.g. https://glovia.com.np)');
        process.exit(1);
    }
}
async function bootstrap() {
    validateProductionEnv();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: process.env.NODE_ENV === 'production'
            ? ['error', 'warn', 'log']
            : ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    const { AllExceptionsFilter } = await Promise.resolve().then(() => require('./common/filters/http-exception.filter'));
    app.useGlobalFilters(new AllExceptionsFilter());
    const configService = app.get(config_1.ConfigService);
    const isProduction = process.env.NODE_ENV === 'production';
    app.use((0, express_1.json)({ limit: '10mb' }));
    app.use((0, express_1.urlencoded)({ limit: '10mb', extended: true }));
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', 1);
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: false,
    }));
    try {
        const raw = process.env.FRONTEND_URL || '';
        const frontendHosts = raw
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .map((u) => {
            try {
                return new URL(u).origin;
            }
            catch {
                return null;
            }
        })
            .filter(Boolean);
        const cdnHosts = [
            'https://res.cloudinary.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
        ];
        app.use(helmet_1.default.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", ...frontendHosts],
                styleSrc: ["'self'", 'https://fonts.googleapis.com', ...frontendHosts],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
                imgSrc: [
                    "'self'",
                    'https://res.cloudinary.com',
                    'https://api.glovia.com.np',
                    ...frontendHosts,
                ],
                connectSrc: ["'self'", ...frontendHosts],
                objectSrc: ["'none'"],
                frameAncestors: ["'none'"],
                upgradeInsecureRequests: isProduction ? [] : null,
            },
        }));
    }
    catch {
    }
    app.enableCors({
        origin: (origin, callback) => {
            const raw = process.env.FRONTEND_URL || (isProduction ? '' : 'http://localhost:3000');
            const allowed = raw
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            if (!origin) {
                callback(null, true);
                return;
            }
            if (allowed.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error(`CORS: origin '${origin}' not allowed`));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'Origin',
            'X-Requested-With',
            'x-csrf-token',
        ],
    });
    app.use(compression({ level: 6, threshold: 1024 }));
    app.use(cookieParser());
    app.use(csrf_middleware_1.default);
    app.use((_req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        if (isProduction) {
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }
        next();
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const apiPrefix = configService.get('API_PREFIX') || 'api/v1';
    app.setGlobalPrefix(apiPrefix);
    if (!isProduction) {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Glovia Marketplace API')
            .setDescription('E-Commerce Platform API Documentation')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('Auth', 'Authentication endpoints')
            .addTag('Users', 'User management')
            .addTag('Products', 'Product catalog')
            .addTag('Categories', 'Product categories')
            .addTag('Orders', 'Order management')
            .addTag('Payments', 'Payment processing')
            .addTag('Admin', 'Admin operations')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    const port = Number(process.env.PORT) || configService.get('PORT') || 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Glovia API running on port ${port} [${process.env.NODE_ENV || 'development'}]`);
}
bootstrap();
//# sourceMappingURL=main.js.map