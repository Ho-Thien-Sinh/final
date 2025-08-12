import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
    const { email, password } = req.body as { email: string; password: string };

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let role: 'admin' | 'user' = 'user';
    if (email === 'admin@example.com') {
        role = 'admin';
    }

    // Create user
    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
    }
}