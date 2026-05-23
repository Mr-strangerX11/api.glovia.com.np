"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = csrfMiddleware;
function csrfMiddleware(req, res, next) {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method))
        return next();
    const headerToken = (req.headers['x-csrf-token'] || req.headers['x-xsrf-token']);
    const cookieToken = (req.cookies && req.cookies['csrf_token']);
    if (!cookieToken || !headerToken) {
        return res.status(403).json({ message: 'CSRF token missing' });
    }
    if (headerToken !== cookieToken) {
        return res.status(403).json({ message: 'Invalid CSRF token' });
    }
    return next();
}
//# sourceMappingURL=csrf.middleware.js.map