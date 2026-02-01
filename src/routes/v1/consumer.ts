import express from 'express';
import consumerAuth from '../consumer/auth';

const router = express.Router();

// Mount consumer public auth router under /auth
router.use('/auth', consumerAuth);

export default router;
