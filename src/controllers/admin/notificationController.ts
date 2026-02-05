import { Request, Response, NextFunction } from 'express';
import Notification from '../../models/Notification';
import { AppError } from '../../utils/AppError';
import { AuditService } from '../../services/auditService';

export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, message, type, target } = req.body;
    const adminId = (req as any).user?.id;

    const notification = await Notification.create({
      title,
      message,
      type,
      target: target || 'all',
      createdBy: adminId
    });

    await AuditService.log({
      userId: adminId,
      action: 'SEND_NOTIFICATION',
      resource: 'SYSTEM',
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { title, target }
    });

    res.status(201).json(notification);
  } catch (err) {
    next(err);
  }
};

export const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    
    // Find notifications targeted to all or to this specific user
    const notifications = await Notification.find({
      $or: [
        { target: 'all' },
        { target: userId }
      ]
    }).sort({ createdAt: -1 }).limit(20);

    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, {
      $addToSet: { isReadBy: userId }
    });

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
};
