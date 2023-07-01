import { SessionRepository } from '@/application/ports/session-repository';
import { RedisSessionRepository } from '@/infra/database/redis-session-repository';
import { getRedisClient } from './redis';
import { env } from '../env';

let sessionRepository: SessionRepository;

export async function getSessionRepository() {
  if (!sessionRepository) {
    const sessionExpirationInSeconds = env.REFRESH_TOKEN_EXPIRATION_IN_SECONDS;
    sessionRepository = new RedisSessionRepository(
      await getRedisClient(),
      sessionExpirationInSeconds,
    );
  }
  return sessionRepository;
}
