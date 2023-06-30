import { SessionRepository } from '@/application/ports/session-repository';
import { RedisStackSessionRepository } from '@/infra/database/redis-stack-session-repository';
import { getRedisClient } from './redis';

let sessionRepository: SessionRepository;

export async function getSessionRepository() {
  if (!sessionRepository) {
    sessionRepository = await RedisStackSessionRepository.create(
      await getRedisClient(),
    );
  }
  return sessionRepository;
}
