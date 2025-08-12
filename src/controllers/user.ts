import { Request, Response } from 'express';
import { User } from '../models/user.model';

export const getMe = async (req: Request, res: Response): Promise<Response | void> => {
	try {
		const userId = (req as any).user?.userId;
		if (!userId) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		const user = await User.findById(userId).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		return res.status(200).json({ user });
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
}
