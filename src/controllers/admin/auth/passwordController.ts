import { Request, Response, NextFunction } from 'express';
import { AuthService } from '#services/authService';
import { AuditService } from '#services/auditService';

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await AuthService.requestPasswordReset(email);
    
    if (user) {
      await AuditService.log({
        userId: (user._id as any).toString(),
        action: 'FORGOT_PASSWORD',
        resource: 'AUTH',
        status: 'success',
        ipAddress: req.ip || '',
        userAgent: req.get('user-agent') || ''
      });
    }

    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, pwd } = req.body;
    const user = await AuthService.resetPassword(token, pwd);

    await AuditService.log({
      userId: (user._id as any).toString(),
      action: 'RESET_PASSWORD',
      resource: 'AUTH',
      status: 'success',
      ipAddress: req.ip || '',
      userAgent: req.get('user-agent') || ''
    });

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    next(err);
  }
};
