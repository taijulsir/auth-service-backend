import { Request, Response } from 'express';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { AppError } from '../../utils/AppError';
import { AuditService } from '../../services/auditService';
import { AuthService } from '../../services/authService';

export const generate2FASecret = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'AdminDash', secret);
    
    // Save secret temporarily but don't enable 2FA yet
    user.twoFactorSecret = secret;
    await user.save();

    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    res.json({
        qrCodeUrl,
        secret // Also provide secret for manual entry
    });
};

export const verify2FASetup = async (req: Request, res: Response) => {
    const { token } = req.body;
    const userId = (req as any).user?.id;
    const user = await User.findById(userId).select('+twoFactorSecret');
    
    if (!user || !user.twoFactorSecret) {
        throw new AppError('2FA not initiated', 400);
    }

    const isValid = authenticator.check(token, user.twoFactorSecret);

    if (!isValid) {
        throw new AppError('Invalid verification code', 400);
    }

    user.is2FAEnabled = true;
    await user.save();

    await AuditService.log({
        userId: user._id.toString(),
        action: '2FA_ENABLED',
        resource: 'USER',
        status: 'success',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
    });

    res.json({ message: '2FA enabled successfully' });
};

export const disable2FA = async (req: Request, res: Response) => {
    const { token } = req.body;
    const userId = (req as any).user?.id;
    const user = await User.findById(userId).select('+twoFactorSecret');

    if (!user || !user.is2FAEnabled) {
        throw new AppError('2FA is not enabled', 400);
    }

    const isValid = authenticator.check(token, user.twoFactorSecret!);

    if (!isValid) {
        throw new AppError('Invalid verification code', 400);
    }

    user.is2FAEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    await AuditService.log({
        userId: user._id.toString(),
        action: '2FA_DISABLED',
        resource: 'USER',
        status: 'success',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
    });

    res.json({ message: '2FA disabled successfully' });
};

export const verify2FALogin = async (req: Request, res: Response) => {
    const { token, mfaToken } = req.body;
    
    try {
        const decoded = jwt.verify(
            mfaToken, 
            process.env.ACCESS_TOKEN_SECRET!
        ) as { userId: string, mfa_pending: boolean };

        if (!decoded.mfa_pending) {
            throw new AppError('Invalid MFA token', 400);
        }

        const user = await User.findById(decoded.userId).select('+twoFactorSecret');
        if (!user || !user.is2FAEnabled || !user.twoFactorSecret) {
            throw new AppError('MFA not enabled for this user', 400);
        }

        const isValid = authenticator.check(token, user.twoFactorSecret);
        if (!isValid) {
            throw new AppError('Invalid verification code', 400);
        }

        const { accessToken, refreshToken, roles } = AuthService.generateTokens(user);
        await AuthService.updateRefreshToken(user._id.toString(), null, refreshToken);

        await AuditService.log({
            userId: user._id.toString(),
            action: 'LOGIN_MFA',
            resource: 'AUTH',
            status: 'success',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ roles, accessToken });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AppError('MFA session expired', 401);
        }
        throw error;
    }
};
