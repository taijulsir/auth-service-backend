import express from 'express';
import consumerRoutes from './v1/consumer';
import adminRoutes from './v1/admin';
import socialAuthRoutes from './v1/socialAuth';

const router = express.Router();

router.use('/v1/consumer', consumerRoutes);
router.use('/v1/admin', adminRoutes);
router.use('/v1/auth', socialAuthRoutes);

export default router;
