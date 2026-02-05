import { Request, Response, NextFunction } from 'express';
import { AuthService } from '#services/authService';
import logger from '#utils/logger';

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, pwd } = req.body;

        const foundUser = await AuthService.verifyUserCredentials(email, pwd);
        const { accessToken, refreshToken, roles } = AuthService.generateTokens(foundUser);

        await AuthService.updateRefreshToken((foundUser._id as any).toString(), null, refreshToken);

        logger.info(`User logged in: ${email}`, { roles });

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Send authorization roles and access token to user
        res.json({ roles, accessToken });
    } catch (err) {
        next(err);
    }
}

