import {Router} from 'express';
import { register } from '../controllers/register';
import { login } from '../controllers/login';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - fullname
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the account
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the account (will be hashed)
 *               fullname:
 *                 type: string
 *                 description: Full name of the user
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     fullname:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *       400:
 *         description: Bad request - missing fields or username already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for login
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for login
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     fullname:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *       400:
 *         description: Invalid credentials or missing fields
 *       500:
 *         description: Internal server error
 */
router.post('/login', login);

export default router;