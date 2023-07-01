import { RedisClientType } from 'redis';
import { Session } from '@/domain/session';
import { SessionRepository } from '@/application/ports/session-repository';

export class RedisSessionRepository implements SessionRepository {
  private static readonly KEY_PREFIX = 'session';

  constructor(
    private readonly redis: RedisClientType,
    private readonly sessionExpirationInSeconds: number,
  ) {}

  async create(session: Session): Promise<void> {
    const key = RedisSessionRepository.makeKey(session.id, session.userId);
    await this.redis.hSet(key, {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      userId: session.userId,
    });
    await this.redis.expire(key, this.sessionExpirationInSeconds);
  }

  async update(session: Session): Promise<void> {
    await this.create(session);
  }

  async findById(sessionId: string): Promise<Session | undefined> {
    const [key] = await this.getAllKeysBy({ sessionId });
    if (!key) {
      return undefined;
    }

    const result = await this.redis.hGetAll(key);
    return Session.create({
      id: sessionId,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      userId: result.userId,
    });
  }

  async existsById(sessionId: string): Promise<boolean> {
    const [key] = await this.getAllKeysBy({ sessionId });
    return Boolean(key);
  }

  async deleteById(sessionId: string): Promise<void> {
    const [key] = await this.getAllKeysBy({ sessionId });
    if (!key) {
      return;
    }

    await this.redis.unlink(key);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    const keys = await this.getAllKeysBy({ userId });
    if (keys.length === 0) {
      return;
    }

    await this.redis.unlink(keys);
  }

  private async getAllKeysBy({ sessionId = '*', userId = '*' }) {
    const keyPattern = `${RedisSessionRepository.KEY_PREFIX}:${sessionId}:${userId}`;
    return this.redis.keys(keyPattern);
  }

  private static makeKey(sessionId: string, userId: string) {
    return `${RedisSessionRepository.KEY_PREFIX}:${sessionId}:${userId}`;
  }
}
