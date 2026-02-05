import { Request, Response, NextFunction } from 'express';
import { AuthService } from '#services/authService';
import logger from '#utils/logger';

export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, pwd } = req.body;
        await AuthService.registerUser(email, pwd);
        logger.info(`New user created: ${email}`);
        res.status(201).json({ 'success': `New user ${email} created!` });
    } catch (err) {
        next(err);
    }
}

