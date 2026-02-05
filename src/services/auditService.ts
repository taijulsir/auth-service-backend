import AuditLog from '#models/AuditLog';
import logger from '#utils/logger';

interface LogOptions {
  userId: string;
  action: string;
  resource: string;
  status: 'success' | 'failure';
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

export class AuditService {
  static async log(options: LogOptions) {
    try {
      await AuditLog.create({
        userId: options.userId,
        action: options.action,
        resource: options.resource,
        status: options.status,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        metadata: options.metadata,
      });
    } catch (error) {
      // Don't throw error if logging fails, but log it to console/logger
      logger.error('Failed to create audit log:', error);
    }
  }

  static async getLogs(filters: any = {}, options: { limit?: number; skip?: number } = {}) {
    return AuditLog.find(filters)
      .sort({ createdAt: -1 })
      .limit(options.limit || 50)
      .skip(options.skip || 0)
      .populate('userId', 'email');
  }
}
