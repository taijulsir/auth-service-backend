import { NextFunction, Request, Response } from "express";
import { UnauthorizedError, ForbiddenError } from "#utils/AppError";

const verifyRoles = (...allowedRoles: number[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req?.roles) {
            return next(new UnauthorizedError('Roles not found in request'));
        }

        const rolesArray = [...allowedRoles];
        const hasPermission = req.roles.some(role => rolesArray.includes(role));

        if (!hasPermission) {
            return next(new ForbiddenError('You do not have permission to access this resource'));
        }

        next();
    }
}

export default verifyRoles;
