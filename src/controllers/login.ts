import {Request, Response} from 'express';
import {User} from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response): Promise<Response | void> => {
    const { email, password } = req.body as { email: string; password: string };

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const isAdmin = user.role === 'admin';
        const userId = user._id;

        const token = jwt.sign({ email: user.email, isAdmin, userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};