import express from 'express';
import loginRoute from '#routes/auth/login';
import refreshRoute from '#routes/auth/refresh';
import logoutRoute from '#routes/auth/logout';
import usersRoute from '#routes/admin/users';
import verifyJWT from '#middleware/verifyJWT';

const router = express.Router();

// Public Admin Auth Routes
router.use('/auth/login', loginRoute);
router.use('/auth/refresh', refreshRoute);
router.use('/auth/logout', logoutRoute);

// Protected Admin Routes
router.use(verifyJWT);
router.use('/users', usersRoute);

export default router;
