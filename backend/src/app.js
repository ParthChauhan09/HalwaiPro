import express from 'express';
import config from './config/env.js';
import connectDB from './config/db.js';

const app = express();

// Database connection - skip in test environment to allow manual control in tests
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

import authRoutes from './routes/auth.routes.js';
import sweetRoutes from './routes/sweet.routes.js';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { notFound, errorHandler } from './middlewares/error.middleware.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Backend is running'
    });
});

app.use(notFound);
app.use(errorHandler);

export default app;
