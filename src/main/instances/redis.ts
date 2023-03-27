import { createClient, RedisClientType } from 'redis';
import { getLogger } from './logger';

let redisClient: RedisClientType;

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient();
    await redisClient.connect();

    const logger = getLogger();
    logger.info('Redis Client: connected successfully');
  }
  return redisClient;
}
