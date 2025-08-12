import { Router } from 'express';
import { returnBook } from '../controllers/borrow';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/:bookId', returnBook);

export default router;