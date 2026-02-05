import { Request, Response, NextFunction } from 'express';
import { AuthService } from '#services/authService';
import { AuditService } from '#services/auditService';
import logger from '#utils/logger';

export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, pwd } = req.body;
        const newUser = await AuthService.registerUser(email, pwd);
        
        await AuditService.log({
            userId: (newUser._id as any).toString(),
            action: 'REGISTER',
            resource: 'AUTH',
            status: 'success',
            ipAddress: req.ip || '',
            userAgent: req.get('user-agent') || ''
        });

        logger.info(`New user created: ${email}`);
        res.status(201).json({ 'success': `New user ${email} created!` });
    } catch (err) {
        next(err);
    }
}

