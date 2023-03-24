import { SessionRepository } from '@/application/ports/session-repository';
import { Session } from '@/domain/session';
import { ErrorReply, RedisClientType, SchemaFieldTypes } from 'redis';

export class RedisSessionRepository implements SessionRepository {
  private static readonly INDEX_NAME = 'idx:session';
  private static readonly KEY_PREFIX = 'session:';

  private constructor(private readonly redis: RedisClientType) {}

  static async create(redis: RedisClientType) {
    const redisSessionRepository = new RedisSessionRepository(redis);
    await redisSessionRepository.createIndex();
    return redisSessionRepository;
  }

  async create(session: Session) {
    await this.redis.json.set(RedisSessionRepository.makeKey(session.id), '$', {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      userId: session.userId,
    });
  }

  async update(session: Session) {
    await this.create(session);
  }

  async findByRefreshToken(refreshToken: string): Promise<Session | undefined> {
    const result = await this.redis.ft.search(
      RedisSessionRepository.INDEX_NAME,
      `@refreshToken:${refreshToken}`,
    );

    if (result.total === 0) {
      return undefined;
    }

    const document = result.documents[0];

    if (
      typeof document.value.accessToken !== 'string' ||
      typeof document.value.refreshToken !== 'string' ||
      typeof document.value.userId !== 'string'
    ) {
      throw new TypeError(
        `Stored session with refresh token '${refreshToken}' is invalid`,
      );
    }

    return Session.create({
      id: RedisSessionRepository.extractIdFromKey(document.id),
      accessToken: document.value.accessToken,
      refreshToken: document.value.refreshToken,
      userId: document.value.userId,
    });
  }

  async existsByAccessToken(accessToken: string) {
    const result = await this.redis.ft.search(
      RedisSessionRepository.INDEX_NAME,
      `@accessToken:${accessToken}`,
    );

    return result.total > 0;
  }

  async deleteByAccessToken(accessToken: string) {
    const result = await this.redis.ft.search(
      RedisSessionRepository.INDEX_NAME,
      `@accessToken:${accessToken}`,
    );

    if (result.total === 0) {
      return;
    }

    const sessionKey = result.documents[0].id;
    await this.redis.unlink(sessionKey);
  }

  async deleteAllByUserId(userId: string) {
    const result = await this.redis.ft.search(
      RedisSessionRepository.INDEX_NAME,
      `@userId:${userId}`,
    );

    if (result.total === 0) {
      return;
    }

    const sessionKeys = result.documents.map((document) => document.id);
    await this.redis.unlink(sessionKeys);
  }

  private async createIndex() {
    const indexExists = await this.existsIndex();

    if (indexExists) {
      return;
    }

    await this.redis.ft.create(
      RedisSessionRepository.INDEX_NAME,
      {
        '$.accessToken': { type: SchemaFieldTypes.TEXT, AS: 'accessToken' },
        '$.refreshToken': { type: SchemaFieldTypes.TEXT, AS: 'refreshToken' },
        '$.userId': { type: SchemaFieldTypes.TEXT, AS: 'userId' },
      },
      { ON: 'JSON', PREFIX: RedisSessionRepository.KEY_PREFIX },
    );
  }

  private async existsIndex() {
    try {
      await this.redis.ft.info(RedisSessionRepository.INDEX_NAME);
    } catch (error) {
      if (error instanceof ErrorReply) {
        return false;
      }
      throw error;
    }
    return true;
  }

  private static makeKey(id: string) {
    return `${RedisSessionRepository.KEY_PREFIX}${id}`;
  }

  private static extractIdFromKey(key: string) {
    return key.slice(RedisSessionRepository.KEY_PREFIX.length);
  }
}
