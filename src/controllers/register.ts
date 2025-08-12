import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, fullname } = req.body as { 
            username: string; 
            password: string; 
            fullname: string; 
        };

        if (!username || !password || !fullname) {
            res.status(400).json({ message: 'Username, password, and fullname are required' });
            return;
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let role: 'admin' | 'user' = 'user';
        if (username === 'admin') {
            role = 'admin';
        }

        const user = new User({ username, password: hashedPassword, fullname, role });
        await user.save();

        res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                fullname: user.fullname,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}