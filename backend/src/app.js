import express from 'express';
import config from './config/env.js';
import connectDB from './config/db.js';

const app = express();

// Database connection - skip in test environment to allow manual control in tests
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Backend is running'
    });
});

export default app;
