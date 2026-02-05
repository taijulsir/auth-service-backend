import { Request, Response, NextFunction } from 'express';
import User from '#models/User';
import { AuthService } from '#services/authService';
import { UnauthorizedError, ForbiddenError } from '#utils/AppError';

export const handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) throw new UnauthorizedError();

        const refreshToken = cookies.jwt;
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

        const foundUser = await User.findOne({ refreshToken }).exec();

        // Detected refresh token reuse!
        if (!foundUser) {
            await AuthService.handleRefreshTokenReuse(refreshToken);
            throw new ForbiddenError();
        }

        const decoded = await AuthService.verifyRefreshToken(refreshToken);
        if (foundUser.email !== decoded.email) throw new ForbiddenError();

        // Refresh token was still valid
        const { accessToken, refreshToken: newRefreshToken, roles } = AuthService.generateTokens(foundUser);

        // Update refresh tokens in DB
        await AuthService.updateRefreshToken((foundUser._id as any).toString(), refreshToken, newRefreshToken);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ roles, accessToken });
    } catch (err) {
        next(err);
    }
}

