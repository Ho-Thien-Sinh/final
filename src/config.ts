import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library-management';
export const PORT = process.env.PORT || 3000;
export const OTP_EXPIRE_TIME = 5 * 60 * 1000; // 5 minutes