import express from 'express';
import adminAuth from '../admin/auth';
import { getAuditLogs } from '#controllers/admin/auditController';
import { getDashboardStats } from '#controllers/admin/analyticsController';
import { createNotification, getMyNotifications, markAsRead } from '../../controllers/admin/notificationController';
import { generate2FASecret, verify2FASetup, disable2FA } from '../../controllers/auth/twoFactorController';
import verifyJWT from '#middleware/verifyJWT';
import verifyRoles from '#middleware/verifyRoles';
import ROLES_LIST from '#config/roles_list';

const router = express.Router();

// Mount admin public auth router under /auth
router.use('/auth', adminAuth);

// 2FA Routes (Protected)
router.post('/2fa/generate', verifyJWT, generate2FASecret);
router.post('/2fa/verify', verifyJWT, verify2FASetup);
router.post('/2fa/disable', verifyJWT, disable2FA);

// Notifications
router.post('/notifications', verifyJWT, verifyRoles(ROLES_LIST.Admin), createNotification);
router.get('/notifications', verifyJWT, getMyNotifications);
router.patch('/notifications/:id/read', verifyJWT, markAsRead);

// Protected admin routes
router.get('/audit-logs', verifyJWT, getAuditLogs);
router.get('/stats', verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), getDashboardStats);

export default router;
