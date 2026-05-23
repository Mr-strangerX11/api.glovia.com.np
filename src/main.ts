import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import csrfMiddleware from './common/middleware/csrf.middleware';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

// Fail fast in production if required environment variables are missing
function validateProductionEnv() {
  if (process.env.NODE_ENV !== 'production') return;

  const required: string[] = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'FRONTEND_URL'];

  // If SMTP email is configured, require SMTP credentials
  if (process.env.EMAIL_PROVIDER === 'smtp') {
    required.push('SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD');
  }

  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('FATAL: Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }

  // FRONTEND_URL must be a valid URL in production
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

  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const { AllExceptionsFilter } = await import('./common/filters/http-exception.filter');
  app.useGlobalFilters(new AllExceptionsFilter());

  const configService = app.get(ConfigService);
  const isProduction = process.env.NODE_ENV === 'production';

  // Body size limits — 10 MB is sufficient for most uploads; 50 MB risks OOM on cPanel
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  // Trust proxy headers — cPanel/Apache sits in front; enables real IP via X-Forwarded-For
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Basic helmet hardening
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );

  // Content Security Policy
  try {
    const raw = process.env.FRONTEND_URL || '';
    const frontendHosts = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((u) => {
        try {
          return new URL(u).origin;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as string[];

    const cdnHosts = [
      'https://res.cloudinary.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", ...frontendHosts],
          styleSrc: ["'self'", 'https://fonts.googleapis.com', ...frontendHosts],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          // Restrict images to known CDNs — do NOT allow data: or blob: globally
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
      })
    );
  } catch {
    // If FRONTEND_URL parsing fails, skip CSP rather than crashing
  }

  // CORS — require explicit FRONTEND_URL in production
  app.enableCors({
    origin: (origin, callback) => {
      const raw = process.env.FRONTEND_URL || (isProduction ? '' : 'http://localhost:3000');
      const allowed = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      // Allow requests with no origin (same-origin, curl, Postman in dev)
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowed.includes(origin)) {
        callback(null, true);
      } else {
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

  // Gzip compression — crucial on low-resource cPanel hosting
  app.use(compression({ level: 6, threshold: 1024 }));

  // Cookie parsing (required for auth + CSRF)
  app.use(cookieParser());

  // CSRF protection for all mutating requests
  app.use(csrfMiddleware);

  // Security headers + HSTS (HTTPS enforcement)
  app.use((_req: any, res: any, next: any) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    if (isProduction) {
      // HSTS: force HTTPS for 1 year, include subdomains
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
  });

  // Input validation — global pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  const apiPrefix = configService.get<string>('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Swagger only in non-production
  if (!isProduction) {
    const config = new DocumentBuilder()
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

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = Number(process.env.PORT) || configService.get<number>('PORT') || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Glovia API running on port ${port} [${process.env.NODE_ENV || 'development'}]`);
}

bootstrap();
