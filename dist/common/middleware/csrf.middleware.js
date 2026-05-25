"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = csrfMiddleware;
const CSRF_EXEMPT = [
    /^\/api\/v\d+\/auth\//,
    /^\/api\/v\d+\/flash-deals\/[^/]+\/view$/,
    /^\/api\/v\d+\/flash-deals\/[^/]+\/click$/,
];
function csrfMiddleware(req, res, next) {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method))
        return next();
    if (CSRF_EXEMPT.some(re => re.test(req.path)))
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