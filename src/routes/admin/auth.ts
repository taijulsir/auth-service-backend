import express from 'express';
import { handleLogin, handleRegister, handleRefreshToken, handleLogout } from '../../controllers/admin/auth/authControllers';

const router = express.Router();

// Define auth endpoints explicitly with HTTP verbs so handlers are clear
// POST /auth/login
router.post('/login', handleLogin);

// POST /auth/register
router.post('/register', handleRegister);

// GET /auth/refresh
router.get('/refresh', handleRefreshToken);

// GET /auth/logout
router.get('/logout', handleLogout);

export default router;
