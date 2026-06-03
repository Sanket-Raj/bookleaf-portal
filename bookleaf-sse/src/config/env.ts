import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: parseInt(process.env.PORT || '5001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

export const validateConfig = () => {
  console.log('✓ Configuration loaded:', {
    port: config.PORT,
    environment: config.NODE_ENV,
    redis: `${config.REDIS_HOST}:${config.REDIS_PORT}`,
  });
};