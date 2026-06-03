import { Router, Request, Response } from 'express';
import { broadcastService } from '../services/broadcast';
import { logger } from '../utils/logger';

const router = Router();

/**
 * SSE Subscribe Endpoint
 * Query parameters:
 *   - userId (required): The user ID to subscribe
 *   - token (optional): JWT token for authentication
 */
router.get('/', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const token = req.query.token as string;

  // Validate userId
  if (!userId || userId.trim() === '') {
    logger.warn('Subscribe request without userId');
    return res.status(400).json({ error: 'userId query parameter is required' });
  }

  // Optional: Validate token
  if (token) {
    // Add token validation logic here if needed
    logger.debug(`Subscribe request from user ${userId} with token`);
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Prevent buffering
  res.flushHeaders();

  // Register connection
  broadcastService.registerConnection(userId, res);

  // Process any queued messages
  broadcastService.processQueuedMessages(userId);

  logger.info(`User ${userId} subscribed to SSE. Total connections: ${broadcastService.getConnectionCount()}`);

  // Keep connection open
  res.on('close', () => {
    logger.info(`SSE connection closed for user ${userId}`);
  });

  res.on('error', (error) => {
    logger.error(`SSE error for user ${userId}:`, error);
  });
});

/**
 * Broadcast Endpoint - Send message to specific user
 * POST /broadcast
 * Body: { userId, type, data }
 */
router.post('/broadcast', (req: Request, res: Response) => {
  const { userId, type, data } = req.body;

  if (!userId || !type || !data) {
    return res.status(400).json({
      error: 'userId, type, and data are required',
    });
  }

  const success = broadcastService.sendToUser(userId, {
    type,
    data,
    timestamp: new Date(),
  });

  res.json({
    success,
    message: success ? 'Message sent' : 'User not connected, message queued',
    connectionCount: broadcastService.getConnectionCount(),
  });
});

/**
 * Broadcast to All Endpoint
 * POST /broadcast-all
 * Body: { type, data }
 */
router.post('/broadcast-all', (req: Request, res: Response) => {
  const { type, data } = req.body;

  if (!type || !data) {
    return res.status(400).json({
      error: 'type and data are required',
    });
  }

  broadcastService.broadcastToAll({
    type,
    data,
  });

  res.json({
    success: true,
    message: 'Broadcast sent to all users',
    connectionCount: broadcastService.getConnectionCount(),
  });
});

/**
 * Broadcast to Group Endpoint
 * POST /broadcast-group
 * Body: { userIds, type, data }
 */
router.post('/broadcast-group', (req: Request, res: Response) => {
  const { userIds, type, data } = req.body;

  if (!Array.isArray(userIds) || !type || !data) {
    return res.status(400).json({
      error: 'userIds (array), type, and data are required',
    });
  }

  broadcastService.broadcastToGroup(userIds, {
    type,
    data,
  });

  res.json({
    success: true,
    message: `Broadcast sent to ${userIds.length} users`,
    connectionCount: broadcastService.getConnectionCount(),
  });
});

/**
 * Health Check Endpoint
 * GET /health
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'sse',
    connections: broadcastService.getConnectionCount(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Status Endpoint
 * GET /status
 */
router.get('/status', (req: Request, res: Response) => {
  res.json({
    service: 'BookLeaf SSE Service',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    connections: {
      total: broadcastService.getConnectionCount(),
      users: broadcastService.getConnectedUsers(),
    },
    queue: broadcastService.getQueueStatus(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Check User Connection Endpoint
 * GET /check/:userId
 */
router.get('/check/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const connected = broadcastService.isUserConnected(userId);

  res.json({
    userId,
    connected,
    timestamp: new Date().toISOString(),
  });
});

export default router;