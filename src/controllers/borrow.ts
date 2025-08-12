import { Request, Response } from 'express';
import { Book } from '../models/book.model';
import { BorrowRecord } from '../models/borrowRecord.model';
import { Types } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     BorrowRecord:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của bản ghi mượn
 *         userId:
 *           type: string
 *           description: ID người dùng
 *         bookId:
 *           type: string
 *           description: ID sách
 *         borrowDate:
 *           type: string
 *           format: date-time
 *           description: Ngày mượn
 *         returnDate:
 *           type: string
 *           format: date-time
 *           description: Ngày trả (null nếu chưa trả)
 *         status:
 *           type: string
 *           enum: [BORROWED, RETURNED]
 *           description: Trạng thái mượn/trả
 */

/**
 * @swagger
 * /borrow/{bookId}:
 *   post:
 *     summary: Mượn sách
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sách cần mượn
 *     responses:
 *       201:
 *         description: Mượn sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 borrowRecord:
 *                   $ref: '#/components/schemas/BorrowRecord'
 *       400:
 *         description: Sách không có sẵn hoặc đã mượn
 *       404:
 *         description: Không tìm thấy sách
 *       500:
 *         description: Lỗi server
 */
export const borrowBook = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { bookId } = req.params;
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.availableQuantity <= 0) {
            return res.status(400).json({ message: 'Book is not available for borrowing' });
        }

        const existingBorrow = await BorrowRecord.findOne({
            userId,
            bookId,
            status: 'BORROWED'
        });

        if (existingBorrow) {
            return res.status(400).json({ message: 'You have already borrowed this book' });
        }

        const borrowRecord = new BorrowRecord({
            userId,
            bookId,
            borrowDate: new Date(),
            status: 'BORROWED'
        });

        await borrowRecord.save();

        book.availableQuantity -= 1;
        await book.save();

        const populatedRecord = await BorrowRecord.findById(borrowRecord._id)
            .populate('bookId', 'title author')
            .populate('userId', 'username fullname');

        return res.status(201).json({
            message: 'Book borrowed successfully',
            borrowRecord: populatedRecord
        });
    } catch (error) {
        console.error('Error borrowing book:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @swagger
 * /return/{bookId}:
 *   post:
 *     summary: Trả sách
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sách cần trả
 *     responses:
 *       200:
 *         description: Trả sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 borrowRecord:
 *                   $ref: '#/components/schemas/BorrowRecord'
 *       400:
 *         description: Không tìm thấy bản ghi mượn hoặc đã trả
 *       404:
 *         description: Không tìm thấy sách
 *       500:
 *         description: Lỗi server
 */
export const returnBook = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { bookId } = req.params;
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }

        const borrowRecord = await BorrowRecord.findOne({
            userId,
            bookId,
            status: 'BORROWED'
        });

        if (!borrowRecord) {
            return res.status(400).json({ message: 'No active borrow record found for this book' });
        }

        borrowRecord.returnDate = new Date();
        borrowRecord.status = 'RETURNED';
        await borrowRecord.save();

        const book = await Book.findById(bookId);
        if (book) {
            book.availableQuantity += 1;
            await book.save();
        }

        const populatedRecord = await BorrowRecord.findById(borrowRecord._id)
            .populate('bookId', 'title author')
            .populate('userId', 'username fullname');

        return res.status(200).json({
            message: 'Book returned successfully',
            borrowRecord: populatedRecord
        });
    } catch (error) {
        console.error('Error returning book:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @swagger
 * /borrow/history:
 *   get:
 *     summary: Lấy lịch sử mượn trả của bản thân
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Đang mượn, Đã trả]
 *         description: Lọc theo trạng thái (tùy chọn)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Số bản ghi trên mỗi trang
 *     responses:
 *       200:
 *         description: Lịch sử mượn trả
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BorrowRecord'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalRecords:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       500:
 *         description: Lỗi server
 */
export const getBorrowHistory = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const userId = (req as any).user?.userId;
        const { status, page = 1, limit = 10 } = req.query;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const query: any = { userId };
        if (status && ['BORROWED', 'RETURNED'].includes(status as string)) {
            query.status = status;
        }

        const pageNum = Math.max(1, parseInt(page as string) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
        const skip = (pageNum - 1) * limitNum;

        const totalRecords = await BorrowRecord.countDocuments(query);
        const totalPages = Math.ceil(totalRecords / limitNum);


        const history = await BorrowRecord.find(query)
            .populate('bookId', 'title author quantity availableQuantity')
            .sort({ borrowDate: -1 })
            .skip(skip)
            .limit(limitNum);

        return res.status(200).json({
            history,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalRecords,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });
    } catch (error) {
        console.error('Error getting borrow history:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};