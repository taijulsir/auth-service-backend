import express from 'express';
import { handleLogin, handleRegister, handleRefreshToken, handleLogout } from '../../controllers/admin/auth/authControllers';
import { forgotPassword, resetPassword } from '../../controllers/admin/auth/passwordController';
import { validate } from '#middleware/validate';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '#schemas/authSchema';

const router = express.Router();

// POST /auth/login
router.post('/login', validate(loginSchema), handleLogin);

// POST /auth/register
router.post('/register', validate(registerSchema), handleRegister);

// GET /auth/refresh
router.get('/refresh', handleRefreshToken);

// GET /auth/logout
router.get('/logout', handleLogout);

// POST /auth/forgot-password
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

// POST /auth/reset-password
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
