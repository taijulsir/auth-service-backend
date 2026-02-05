import { Request, Response, NextFunction } from 'express';
import { UserService } from '#services/userService';

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
        await UserService.deleteUser(req.body.id);
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
