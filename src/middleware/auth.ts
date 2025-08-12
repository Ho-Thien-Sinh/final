import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { JWT_SECRET } from '../config';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: 'admin' | 'user';
                username: string;
                isAdmin: boolean;
            }
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = {
            userId: decoded.userId,
            role: decoded.role || (decoded.isAdmin ? 'admin' : 'user'),
            username: decoded.username,
            isAdmin: decoded.isAdmin || decoded.role === 'admin'
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    next();
};
