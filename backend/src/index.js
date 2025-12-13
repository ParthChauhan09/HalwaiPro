import express from 'express';
import config from './config/env.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Start server
// eslint-disable-next-line no-console
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
