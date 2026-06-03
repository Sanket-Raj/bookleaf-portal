import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config, validateConfig } from './config/env';
import { initializeRedis, closeRedis } from './config/redis';
import { logger } from './utils/logger';
import subscribeRoutes from './routes/subscribe';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  logger.debug(`${req.method} ${req.path}`, { query: req.query });
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'sse-server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// SSE routes
app.use('/subscribe', subscribeRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Shutting down gracefully...');
  await closeRedis();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
  try {
    validateConfig();
    
    await initializeRedis();

    app.listen(config.PORT, () => {
      logger.info(`✓ SSE Server started on port ${config.PORT}`);
      logger.info(`✓ Environment: ${config.NODE_ENV}`);
      logger.info(`✓ CORS enabled for: ${config.CORS_ORIGIN}`);
    });
  } catch (error) {
    logger.error('Failed to start SSE server', error);
    process.exit(1);
  }
};

startServer();

export default app;