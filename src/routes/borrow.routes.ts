import { Router } from 'express';
import { borrowBook, returnBook, getBorrowHistory } from '../controllers/borrow';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/history', getBorrowHistory);

router.post('/:bookId', borrowBook);

export default router;