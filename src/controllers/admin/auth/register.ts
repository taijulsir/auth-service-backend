import { Request, Response } from 'express';
import User from '#models/User';
import bcrypt from 'bcrypt';
import logger from '#utils/logger';

export const handleRegister = async (req: Request, res: Response) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) {
        logger.warn(`Registration attempt for existing email: ${email}`);
        return res.sendStatus(409);
    }

    try {
        // encrypt the password
        const hashedPassword = await bcrypt.hash(pwd, 10);

        // create and store the new user
        await User.create({
            email: email,
            password: hashedPassword
        });

        logger.info(`New user created: ${email}`);
        res.status(201).json({ 'success': `New user ${email} created!` });
    } catch (err: any) {
        logger.error(`Error creating user ${email}`, { error: err.message });
        res.status(500).json({ 'message': err.message });
    }
}

