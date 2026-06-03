import redis, { RedisClientType } from 'redis';
import { config } from './env';

let redisClient: RedisClientType | null = null;

export const initializeRedis = async (): Promise<RedisClientType> => {
  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = redis.createClient({
      socket: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
      },
      password: config.REDIS_PASSWORD || undefined,
      database: 0,
    }) as RedisClientType;

    redisClient.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✓ Redis connected successfully');
    });

    redisClient.on('ready', () => {
      console.log('✓ Redis ready for commands');
    });

    await redisClient.connect();

    // Test connection
    await redisClient.ping();
    console.log('✓ Redis ping successful');

    return redisClient;
  } catch (error) {
    console.error('✗ Failed to initialize Redis:', error);
    throw error;
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis not initialized. Call initializeRedis() first.');
  }
  return redisClient;
};

export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log('✓ Redis connection closed');
  }
};

export const publishEvent = async (
  channel: string,
  message: Record<string, any>
): Promise<number> => {
  const client = getRedisClient();
  const messageString = JSON.stringify(message);
  return client.publish(channel, messageString);
};

export const subscribeToChannel = async (
  channel: string,
  callback: (message: string) => void
): Promise<void> => {
  const client = getRedisClient();
  
  const subscriber = client.duplicate();
  await subscriber.connect();

  await subscriber.subscribe(channel, (message) => {
    callback(message);
  });

  console.log(`✓ Subscribed to channel: ${channel}`);
};