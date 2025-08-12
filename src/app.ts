import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import dotenv from 'dotenv';
import { setupSwagger } from './config/swagger';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Setup Swagger documentation
setupSwagger(app);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI as string)
.then(() => {
    console.log('MongoDB connected');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

export default app;
