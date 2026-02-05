import { Request, Response, NextFunction } from 'express';
import User from '#models/User';

export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204); // No content
        const refreshToken = cookies.jwt;

        // Is refreshToken in db?
        const foundUser = await User.findOne({ refreshToken }).exec();
        if (foundUser) {
            // Delete refreshToken in db
            foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
            await foundUser.save();
        }

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

