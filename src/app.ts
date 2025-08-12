import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import bookRoutes from './routes/book.routes';
import borrowRoutes from './routes/borrow.routes';
import returnRoutes from './routes/return.routes';
import { MONGODB_URI } from './config';
import { setupSwagger } from './config/swagger';

const app = express();

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/return', returnRoutes);

setupSwagger(app);

// MongoDB connection
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('MongoDB connected');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

export default app;
