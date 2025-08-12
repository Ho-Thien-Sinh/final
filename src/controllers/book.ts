/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của sách
 *         title:
 *           type: string
 *           description: Tiêu đề sách
 *         author:
 *           type: string
 *           description: Tác giả
 *         quantity:
 *           type: number
 *           description: Tổng số lượng sách
 *         availableQuantity:
 *           type: number
 *           description: Số lượng sách có sẵn để mượn
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

import { Request, Response } from 'express';
import { Book } from '../models/book.model';

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Tạo sách mới (admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề sách
 *               author:
 *                 type: string
 *                 description: Tác giả
 *               quantity:
 *                 type: number
 *                 description: Số lượng sách (mặc định là 1)
 *     responses:
 *       201:
 *         description: Sách được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Thiếu thông tin bắt buộc
 *       403:
 *         description: Không có quyền truy cập - cần role admin
 *       500:
 *         description: Lỗi server
 */

export const createBook = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const userRole = (req as any).user?.role;
        if (userRole !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required.' });
        }
        
        const { title, author, quantity } = req.body;
        
        // Validate required fields
        if (!title || !author) {
            return res.status(400).json({ message: 'Title and author are required' });
        }
        
        const bookQuantity = quantity || 1;
        const book = new Book({ 
            title, 
            author, 
            quantity: bookQuantity,
            availableQuantity: bookQuantity
        });
        
        await book.save();
        return res.status(201).json({ 
            message: 'Book created successfully',
            book 
        });
    } catch (error) {
        console.error('Error creating book:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Lấy danh sách sách
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sách
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       500:
 *         description: Lỗi server
 */

export const getBooks = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const books = await Book.find();
        return res.status(200).json({ books });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};