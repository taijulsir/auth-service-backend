import { Request, Response, NextFunction } from 'express';
import { AuthService } from '#services/authService';
import { AuditService } from '#services/auditService';
import logger from '#utils/logger';

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, pwd } = req.body;
    try {
        const foundUser = await AuthService.verifyUserCredentials(email, pwd);
        
        if (foundUser.is2FAEnabled) {
            const mfaToken = AuthService.generate2FAChallengeToken(foundUser._id.toString());
            return res.json({ 
                requiresMFA: true, 
                mfaToken,
                email: foundUser.email 
            });
        }

        const { accessToken, refreshToken, roles } = AuthService.generateTokens(foundUser);
        // ...existing code...

        await AuditService.log({
            userId: (foundUser._id as any).toString(),
            action: 'LOGIN',
            resource: 'AUTH',
            status: 'success',
            ipAddress: req.ip || '',
            userAgent: req.get('user-agent') || ''
        });

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

