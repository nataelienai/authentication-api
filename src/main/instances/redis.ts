import { createClient, RedisClientType } from 'redis';
import { getLogger } from './logger';
import { env } from '../env';

let redisClient: RedisClientType;

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({ url: env.REDIS_URL });
    await redisClient.connect();

    const logger = getLogger();
    logger.info('Redis Client: connected successfully');
  }
  return redisClient;
}
