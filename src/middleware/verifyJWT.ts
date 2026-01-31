/// <reference path="../types.d.ts" />
import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || (req.headers.Authorization as string);
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
        (err, decoded: any) => {
            if (err) return res.sendStatus(403); // Invalid token
            req.user = decoded.UserInfo.email;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

export default verifyJWT;
