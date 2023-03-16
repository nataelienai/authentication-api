import { SessionRepository } from '@/application/ports/session-repository';
import { RedisSessionRepository } from '@/infra/database/redis-session-repository';
import { getRedisClient } from '../connections/redis';

let sessionRepository: SessionRepository;

export async function getSessionRepository() {
  if (!sessionRepository) {
    sessionRepository = await RedisSessionRepository.create(
      await getRedisClient(),
    );
  }
  return sessionRepository;
}
