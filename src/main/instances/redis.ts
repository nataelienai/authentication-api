/* eslint-disable no-console */
import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient();
    await redisClient.connect();
    console.log('Redis Client: connected successfully');
  }
  return redisClient;
}
