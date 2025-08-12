import { Router } from 'express';
import { getMe } from '../controllers/user';
import { createBook, getBooks } from '../controllers/book';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Lấy thông tin user hiện tại
router.get('/me', authMiddleware, getMe);

// Quản lý sách
router.post('/books', authMiddleware, createBook); // Chỉ admin
router.get('/books', authMiddleware, getBooks);    // Tất cả user

export default router;
