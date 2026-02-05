import { Request, Response, NextFunction } from 'express';
import { UserService } from '#services/userService';
import { AuditService } from '#services/auditService';

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.getAllUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = (req as any).user?.id;
        const targetId = req.body.id;
        
        await UserService.deleteUser(targetId);

        await AuditService.log({
            userId: adminId,
            action: 'DELETE_USER',
            resource: 'USER',
            status: 'success',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            metadata: { targetUserId: targetId }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserById(req.params.id as string);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

export default {
    getAllUsers,
    deleteUser,
    getUser
}
