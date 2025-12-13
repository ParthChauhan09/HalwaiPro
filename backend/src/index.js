import express from 'express';
import config from './config/env.js';
import connectDB from './config/db.js';

const app = express();

// Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Backend is running' });
});

// Start server
// eslint-disable-next-line no-console
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
