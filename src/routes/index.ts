import express from 'express';
import consumerRoutes from './v1/consumer';
import adminRoutes from './v1/admin';

const router = express.Router();

router.use('/v1/consumer', consumerRoutes);
router.use('/v1/admin', adminRoutes);

export default router;
