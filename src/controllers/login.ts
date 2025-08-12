import {Request, Response} from 'express';
import {User} from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const login = async (req: Request, res: Response): Promise<Response | void> => {
    const { username, password } = req.body as { username: string; password: string };

    try {
        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isAdmin = user.role === 'admin';
        const userId = user._id;

        const token = jwt.sign({ 
            username: user.username, 
            isAdmin, 
            userId,
            role: user.role 
        }, JWT_SECRET, { expiresIn: '24h' });
        
        return res.status(200).json({ 
            message: 'Login successful', 
            token,
            user: {
                id: user._id,
                username: user.username,
                fullname: user.fullname,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};