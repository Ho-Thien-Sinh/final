import { Request, Response } from 'express';
import { User } from '../models/user.model';

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Lấy thông tin user hiện tại
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID của user
 *                     username:
 *                       type: string
 *                       description: Tên đăng nhập
 *                     fullname:
 *                       type: string
 *                       description: Họ tên đầy đủ
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *                       description: Vai trò của user
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *       404:
 *         description: Không tìm thấy user
 *       500:
 *         description: Lỗi server
 */
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
		return res.status(200).json({ 
			user: {
				id: user._id,
				username: user.username,
				fullname: user.fullname,
				role: user.role,
			}
		});
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
}
