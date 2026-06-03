import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { logger } from './utils/logger';
import authRoutes from './routes/auth.routes';

const app = express();
const PORT = config.PORT || 5000;

// Apply standard global request processors
app.use(cors());
app.use(express.json());

// Application base diagnostic heartbeat endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Bind route gateway prefixes
app.use('/api/v1/auth', authRoutes);

// General fallback capture route for unsupported path requests
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Resource footprint ${req.originalUrl} not found.` });
});

// Boot listening layer engine
app.listen(PORT, () => {
  logger.info(`🚀 BookLeaf core server running securely in [${config.NODE_ENV}] mode on port ${PORT}`);
});

export default app;