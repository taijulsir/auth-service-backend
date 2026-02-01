import { Request, Response } from 'express';
import User from '#models/User';
import jwt from 'jsonwebtoken';

export const handleRefreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // No cookie found

    // Potential Reuse Detection:
    // This is the refresh token sent by the client
    const refreshToken = cookies.jwt;

    // Clear the cookie logic handled at end or if invalid
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

    const foundUser = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse!
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!,
            async (err: any, decoded: any) => {
                if (err) return res.sendStatus(403); // Forbidden
                // Hacked User! Parsing the stolen token to find who it belongs to
                const hackedUser = await User.findOne({ email: decoded.email }).exec();
                if (hackedUser) {
                    hackedUser.refreshToken = []; // Invalidate all tokens
                    await hackedUser.save();
                }
            }
        )
        return res.sendStatus(403); // Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    // Evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: any, decoded: any) => {
            if (err) {
                // Expired or invalid - just update DB state
                foundUser.refreshToken = [...newRefreshTokenArray];
                await foundUser.save();
            }
            if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

            // Refresh token was still valid
            const roles = Object.values(foundUser.roles).filter(Boolean);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": decoded.email,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: '15m' }
            );

            const newRefreshToken = jwt.sign(
                { "email": foundUser.email },
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: '7d' }
            );

            // Saving refreshToken with current user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await foundUser.save();

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.json({ roles, accessToken })
        }
    );
}

