import { Request, Response, NextFunction } from 'express';
import { AuthService } from '#services/authService';
import logger from '#utils/logger';

export const socialAuthSuccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as any;
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }

        const { accessToken, refreshToken, roles } = AuthService.generateTokens(user);

        await AuthService.updateRefreshToken((user._id as any).toString(), null, refreshToken);

        logger.info(`User logged in via social: ${user.email}`, { provider: user.provider });

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Redirect to frontend with access token in URL (standard for social auth)
        // Alternatively, use a postMessage approach for more security
        res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${accessToken}&roles=${JSON.stringify(roles)}`);
    } catch (err) {
        next(err);
    }
}
