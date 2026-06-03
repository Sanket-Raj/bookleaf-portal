import { Response } from 'express';
import { publishEvent } from '../config/redis';
import { logger } from '../utils/logger';

interface SSEConnection {
  userId: string;
  response: Response;
  connectedAt: Date;
}

interface SSEMessage {
  type: 'notification' | 'update' | 'alert' | 'event';
  userId?: string;
  broadcast?: boolean;
  data: Record<string, any>;
  timestamp: Date;
}

class BroadcastService {
  private connections: Map<string, SSEConnection> = new Map();
  private messageQueue: SSEMessage[] = [];

  /**
   * Register a new SSE connection
   */
  registerConnection(userId: string, response: Response): void {
    this.connections.set(userId, {
      userId,
      response,
      connectedAt: new Date(),
    });

    logger.info(`User ${userId} connected to SSE`);

    // Send initial connection message
    this.sendToUser(userId, {
      type: 'event',
      data: { status: 'connected', userId },
      timestamp: new Date(),
    });

    // Setup disconnect handler
    response.on('close', () => {
      this.removeConnection(userId);
    });

    response.on('error', (error) => {
      logger.error(`SSE connection error for user ${userId}:`, error);
      this.removeConnection(userId);
    });

    // Send heartbeat every 30 seconds
    const heartbeatInterval = setInterval(() => {
      if (this.connections.has(userId)) {
        this.sendHeartbeat(userId);
      } else {
        clearInterval(heartbeatInterval);
      }
    }, 30000);
  }

  /**
   * Remove a connection
   */
  removeConnection(userId: string): void {
    const connection = this.connections.get(userId);
    
    if (connection) {
      try {
        connection.response.end();
      } catch (error) {
        logger.error(`Error closing connection for user ${userId}:`, error);
      }

      this.connections.delete(userId);
      logger.info(`User ${userId} disconnected from SSE`);
    }
  }

  /**
   * Send message to specific user
   */
  sendToUser(userId: string, message: SSEMessage): boolean {
    const connection = this.connections.get(userId);

    if (!connection) {
      logger.warn(`User ${userId} not connected. Message queued.`);
      this.messageQueue.push({ ...message, userId });
      return false;
    }

    try {
      const formattedMessage = this.formatSSEMessage(message);
      connection.response.write(formattedMessage);
      logger.debug(`Message sent to user ${userId}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send message to user ${userId}:`, error);
      this.removeConnection(userId);
      return false;
    }
  }

  /**
   * Broadcast message to all connected users
   */
  broadcastToAll(message: Omit<SSEMessage, 'userId'>): void {
    const broadcastMessage = {
      ...message,
      broadcast: true,
      timestamp: new Date(),
    };

    let successCount = 0;

    this.connections.forEach((connection) => {
      try {
        const formattedMessage = this.formatSSEMessage(broadcastMessage);
        connection.response.write(formattedMessage);
        successCount++;
      } catch (error) {
        logger.error(`Failed to broadcast to user ${connection.userId}:`, error);
        this.removeConnection(connection.userId);
      }
    });

    logger.info(`Broadcast sent to ${successCount} users`);

    // Publish to Redis for other SSE instances
    publishEvent('broadcast:all', broadcastMessage).catch((error) => {
      logger.error('Failed to publish broadcast to Redis:', error);
    });
  }

  /**
   * Broadcast message to specific group/role
   */
  broadcastToGroup(
    userIds: string[],
    message: Omit<SSEMessage, 'userId'>
  ): void {
    const groupMessage = {
      ...message,
      timestamp: new Date(),
    };

    let successCount = 0;

    userIds.forEach((userId) => {
      if (this.sendToUser(userId, { ...groupMessage, userId } as SSEMessage)) {
        successCount++;
      }
    });

    logger.info(`Group broadcast sent to ${successCount}/${userIds.length} users`);

    // Publish to Redis
    publishEvent('broadcast:group', {
      ...groupMessage,
      userIds,
    }).catch((error) => {
      logger.error('Failed to publish group broadcast to Redis:', error);
    });
  }

  /**
   * Send heartbeat to user
   */
  private sendHeartbeat(userId: string): void {
    const connection = this.connections.get(userId);

    if (connection) {
      try {
        connection.response.write(': heartbeat\n\n');
      } catch (error) {
        logger.error(`Heartbeat failed for user ${userId}:`, error);
        this.removeConnection(userId);
      }
    }
  }

  /**
   * Format message for SSE
   */
  private formatSSEMessage(message: SSEMessage): string {
    const data = JSON.stringify(message);
    return `data: ${data}\n\n`;
  }

  /**
   * Get connection count
   */
  getConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * Get connected users
   */
  getConnectedUsers(): string[] {
    return Array.from(this.connections.keys());
  }

  /**
   * Check if user is connected
   */
  isUserConnected(userId: string): boolean {
    return this.connections.has(userId);
  }

  /**
   * Process queued messages when user reconnects
   */
  processQueuedMessages(userId: string): void {
    const userMessages = this.messageQueue.filter((msg) => msg.userId === userId);

    if (userMessages.length > 0) {
      userMessages.forEach((message) => {
        this.sendToUser(userId, message);
      });

      // Remove processed messages from queue
      this.messageQueue = this.messageQueue.filter((msg) => msg.userId !== userId);

      logger.info(`Sent ${userMessages.length} queued messages to user ${userId}`);
    }
  }

  /**
   * Clear message queue
   */
  clearQueue(): void {
    const size = this.messageQueue.length;
    this.messageQueue = [];
    logger.info(`Cleared message queue (${size} messages)`);
  }

  /**
   * Get queue status
   */
  getQueueStatus(): { size: number; oldest?: Date } {
    return {
      size: this.messageQueue.length,
      oldest: this.messageQueue[0]?.timestamp,
    };
  }
}

export const broadcastService = new BroadcastService();