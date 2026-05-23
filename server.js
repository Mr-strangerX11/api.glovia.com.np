// cPanel NodeJS Selector startup script — production & development
// Set NODE_ENV=production in cPanel environment variables panel before starting.

const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod';

// Graceful shutdown handler — called by PM2 / cPanel process manager
function setupGracefulShutdown() {
  const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  signals.forEach((signal) => {
    process.on(signal, () => {
      console.log(`[server] Received ${signal}, shutting down gracefully...`);
      // Allow 5 s for in-flight requests to finish, then exit
      setTimeout(() => {
        console.log('[server] Forced exit after timeout');
        process.exit(0);
      }, 5000).unref();
    });
  });

  process.on('uncaughtException', (err) => {
    console.error('[server] Uncaught exception:', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('[server] Unhandled promise rejection:', reason);
    process.exit(1);
  });
}

async function start() {
  setupGracefulShutdown();

  try {
    if (isProd) {
      // Production: run compiled dist output
      require('./dist/main');
      console.log('[server] Backend started from dist/main (production)');
    } else {
      // Development: run TypeScript source via ts-node
      require('ts-node/register');
      require('tsconfig-paths/register');
      const main = require('./src/main');
      if (typeof main.bootstrap === 'function') {
        await main.bootstrap();
      }
      console.log('[server] Backend started from src/main (development)');
    }
  } catch (err) {
    console.error('[server] Failed to start:', err);
    process.exit(1);
  }
}

start();
