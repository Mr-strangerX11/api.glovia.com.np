import { Request, Response, NextFunction } from 'express';
export default function csrfMiddleware(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
