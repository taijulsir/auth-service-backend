import { Request, Response } from 'express';
import User from '#models/User';
import bcrypt from 'bcrypt';

const handleNewUser = async (req: Request, res: Response) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) return res.sendStatus(409); // Conflict 

    try {
        // encrypt the password
        const hashedPassword = await bcrypt.hash(pwd, 10);

        // create and store the new user
        await User.create({
            email: email,
            password: hashedPassword
        });

        res.status(201).json({ 'success': `New user ${email} created!` });
    } catch (err: any) {
        res.status(500).json({ 'message': err.message });
    }
}

export default { handleNewUser };
