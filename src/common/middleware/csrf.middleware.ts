import { Request, Response, NextFunction } from 'express';

// Auth routes are the CSRF bootstrap — user has no token before login/register.
// Analytics POST routes (view/click) are fire-and-forget and unauthenticated.
const CSRF_EXEMPT = [
  /^\/api\/v\d+\/auth\//,
  /^\/api\/v\d+\/flash-deals\/[^/]+\/view$/,
  /^\/api\/v\d+\/flash-deals\/[^/]+\/click$/,
];

export default function csrfMiddleware(req: Request, res: Response, next: NextFunction) {
  // Safe methods do not require CSRF check
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) return next();

  // Exempt public bootstrap and analytics routes
  if (CSRF_EXEMPT.some(re => re.test(req.path))) return next();

  // Read token from header (recommended) or fallback to x-xsrf-token
  const headerToken = (req.headers['x-csrf-token'] || req.headers['x-xsrf-token']) as string;
  const cookieToken = (req.cookies && (req.cookies as any)['csrf_token']) as string | undefined;

  if (!cookieToken || !headerToken) {
    return res.status(403).json({ message: 'CSRF token missing' });
  }

  if (headerToken !== cookieToken) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  return next();
}
