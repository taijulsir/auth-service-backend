import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '#utils/AppError';

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = (req.headers.authorization || req.headers.Authorization) as string;
    
    if (!authHeader?.startsWith('Bearer ')) {
        return next(new UnauthorizedError('Missing or invalid authorization header'));
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
        (err: any, decoded: any) => {
            if (err) {
                return next(new ForbiddenError('Invalid or expired token'));
            }
            
            req.user = decoded.UserInfo.email;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

export default verifyJWT;
