import { Request, Response, NextFunction } from 'express';
import { AuthService } from '#services/authService';
import { AuditService } from '#services/auditService';

export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204); // No content
        const refreshToken = cookies.jwt;

        const user = await AuthService.logout(refreshToken);

        if (user) {
            await AuditService.log({
                userId: (user._id as any).toString(),
                action: 'LOGOUT',
                resource: 'AUTH',
                status: 'success',
                ipAddress: req.ip || '',
                userAgent: req.get('user-agent') || ''
            });
        }

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

