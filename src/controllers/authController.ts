import { Request, Response } from 'express';
import User from '#models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const handleLogin = async (req: Request, res: Response) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.sendStatus(401); // Unauthorized

    // Evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password!);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // Create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '15m' } // 15 minutes
        );
        const newRefreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '7d' }
        );

        // Standard Rotation
        let newRefreshTokenArray =
            !foundUser.refreshToken
                ? [newRefreshToken]
                : foundUser.refreshToken.concat(newRefreshToken);

        // Filter out any undefined/nulls just in case
        newRefreshTokenArray = newRefreshTokenArray.filter(rt => rt);

        foundUser.refreshToken = newRefreshTokenArray;
        await foundUser.save();

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            secure: true, // Production requires HTTPS
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Send authorization roles and access token to user
        res.json({ roles, accessToken });
    } else {
        res.sendStatus(401);
    }
}

export default { handleLogin };
