import dotenv from 'dotenv';

dotenv.config();

// Required env
const requiredEnvVars = ['PORT', 'NODE_ENV'];

const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Export config 
const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  database: {
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/halwaipro',
  },
};

export default config;
