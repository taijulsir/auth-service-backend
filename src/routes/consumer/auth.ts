import express from 'express';
import { handleLogin, handleRegister, handleRefreshToken, handleLogout } from '../../controllers/admin/auth/authControllers';
import { validate } from '#middleware/validate';
import { loginSchema, registerSchema } from '#schemas/authSchema';

const router = express.Router();

// POST /auth/login
router.post('/login', validate(loginSchema), handleLogin);

// POST /auth/register
router.post('/register', validate(registerSchema), handleRegister);

// GET /auth/refresh
router.get('/refresh', handleRefreshToken);

// GET /auth/logout
router.get('/logout', handleLogout);

export default router;
