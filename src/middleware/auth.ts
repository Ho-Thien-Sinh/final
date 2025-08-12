import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: 'admin' | 'user';
                email: string;
            }
        }
    }
}
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        // Gán thông tin user vào req
        req.user = {
            userId: decoded.userId,
            role: decoded.isAdmin ? 'admin' : 'user',
            email: decoded.email
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
