import { Request, Response, NextFunction } from 'express';
import User from '#models/User';
import bcrypt from 'bcrypt';
import logger from '#utils/logger';
import { ForbiddenError } from '#utils/AppError';

export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, pwd } = req.body;

        // check for duplicate usernames in the db
        const duplicate = await User.findOne({ email }).exec();
        if (duplicate) {
            logger.warn(`Registration attempt for existing email: ${email}`);
            throw new ForbiddenError('Email already exists');
        }

        // encrypt the password
        const hashedPassword = await bcrypt.hash(pwd, 10);

        // create and store the new user
        await User.create({
            email: email,
            password: hashedPassword
        });

        logger.info(`New user created: ${email}`);
        res.status(201).json({ 'success': `New user ${email} created!` });
    } catch (err) {
        next(err);
    }
}

