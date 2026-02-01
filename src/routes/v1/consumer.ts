import express from 'express';
import loginRoute from '#routes/auth/login';
import registerRoute from '#routes/auth/register';
import refreshRoute from '#routes/auth/refresh';
import logoutRoute from '#routes/auth/logout';
import authLimiter from '#middleware/rateLimiter';

const router = express.Router();

// Apply rate limiter to auth endpoints
router.use('/auth', authLimiter);
// Public Routes
router.use('/auth/login', loginRoute);
router.use('/auth/register', registerRoute);
router.use('/auth/refresh', refreshRoute);
router.use('/auth/logout', logoutRoute);

export default router;
