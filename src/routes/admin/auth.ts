import express from 'express';
import { handleLogin, handleRegister, handleRefreshToken, handleLogout } from '../../controllers/admin/auth/authControllers';
import { verify2FALogin } from '../../controllers/auth/twoFactorController';
import { validate } from '#middleware/validate';
import { loginSchema, registerSchema } from '#schemas/authSchema';

const router = express.Router();

// Define auth endpoints explicitly with HTTP verbs so handlers are clear
/**
 * @swagger
 * /api/v1/admin/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, pwd]
 *             properties:
 *               email:
 *                 type: string
 *               pwd:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', validate(loginSchema), handleLogin);

/**
 * @swagger
 * /api/v1/admin/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, pwd]
 *             properties:
 *               email:
 *                 type: string
 *               pwd:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Bad request
 */
router.post('/register', validate(registerSchema), handleRegister);

// POST /auth/verify-mfa
router.post('/verify-mfa', verify2FALogin);

// GET /auth/refresh
router.get('/refresh', handleRefreshToken);

// GET /auth/logout
router.get('/logout', handleLogout);

export default router;
