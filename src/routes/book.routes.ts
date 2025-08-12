import { Router } from 'express';
import { createBook, getBooks } from '../controllers/book';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', adminMiddleware, createBook);

router.get('/', getBooks);

export default router;