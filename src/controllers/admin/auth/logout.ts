import { Request, Response, NextFunction } from 'express';
import { AuthService } from '#services/authService';

export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204); // No content
        const refreshToken = cookies.jwt;

        await AuthService.logout(refreshToken);

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

