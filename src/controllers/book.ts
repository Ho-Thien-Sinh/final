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
 * /users/books:
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
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sách được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

export const createBook = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const userRole = (req as any).user?.role;
        if (userRole !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const { title, author } = req.body;
        const book = new Book({ title, author });
        await book.save();
        return res.status(201).json({ book });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @swagger
 * /users/books:
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