import { Request, Response, NextFunction } from 'express';
import { AuthService } from '#services/authService';

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await AuthService.requestPasswordReset(email);
    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, pwd } = req.body;
    await AuthService.resetPassword(token, pwd);
    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    next(err);
  }
};
