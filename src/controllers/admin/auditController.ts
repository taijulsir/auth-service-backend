import { Request, Response, NextFunction } from 'express';
import { AuditService } from '#services/auditService';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const logs = await AuditService.getLogs({}, { limit, skip });
    res.json({ logs });
  } catch (err) {
    next(err);
  }
};
