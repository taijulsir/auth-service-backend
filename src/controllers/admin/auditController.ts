import { Request, Response, NextFunction } from 'express';
import { AuditService } from '#services/auditService';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const userId = (req as any).user?.id;
    const roles = (req as any).user?.roles || [];
    const isAdmin = roles.includes(5150); // Assuming 5150 is Admin

    let filters: any = {};
    if (!isAdmin) {
      filters.userId = userId;
    } else if (req.query.userId) {
      // Admin can filter by a specific user if they want
      filters.userId = req.query.userId;
    }

    const logs = await AuditService.getLogs(filters, { limit, skip });
    res.json({ logs });
  } catch (err) {
    next(err);
  }
};
