import express from 'express';
import adminAuth from '../admin/auth';

const router = express.Router();

// Mount admin public auth router under /auth
router.use('/auth', adminAuth);

export default router;
