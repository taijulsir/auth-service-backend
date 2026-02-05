import { Request, Response, NextFunction } from 'express';
import User from '#models/User';
import AuditLog from '#models/AuditLog';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'ACTIVE' });
    
    // Aggregate users by status
    const usersByStatus = await User.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Simple login activity for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const loginActivity = await AuditLog.aggregate([
      { 
        $match: { 
          action: 'LOGIN', 
          createdAt: { $gt: sevenDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      usersByStatus,
      loginActivity
    });
  } catch (err) {
    next(err);
  }
};
