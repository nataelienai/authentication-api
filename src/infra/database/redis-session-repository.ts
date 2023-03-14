import { SessionRepository } from '@/application/ports/session-repository';
import { Session } from '@/domain/session';
import { ErrorReply, RedisClientType, SchemaFieldTypes } from 'redis';

export class RedisSessionRepository implements SessionRepository {
  private readonly INDEX_NAME = 'idx:session';

  private readonly KEY_PREFIX = 'session:';

  private constructor(private readonly redis: RedisClientType) {}

  static async create(redis: RedisClientType) {
    const redisSessionRepository = new RedisSessionRepository(redis);
    await redisSessionRepository.createIndex();
    return redisSessionRepository;
  }

  async create(session: Session) {
    await this.redis.json.set(this.makeKey(session.id), '$', {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      userId: session.userId,
    });
  }

  async update(session: Session) {
    await this.redis.json.set(this.makeKey(session.id), '$', {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      userId: session.userId,
    });
  }

  async findByRefreshToken(refreshToken: string) {
    const result = await this.redis.ft.search(
      this.INDEX_NAME,
      `@refreshToken:${refreshToken}`,
    );

    if (result.total === 0) {
      return null;
    }

    const document = result.documents[0];

    if (
      typeof document.value.accessToken !== 'string' ||
      typeof document.value.refreshToken !== 'string' ||
      typeof document.value.userId !== 'string'
    ) {
      throw new Error(
        `Stored session with refresh token '${refreshToken}' is invalid`,
      );
    }

    return Session.create({
      id: this.extractIdFromKey(document.id),
      accessToken: document.value.accessToken,
      refreshToken: document.value.refreshToken,
      userId: document.value.userId,
    });
  }

  async existsByAccessToken(accessToken: string) {
    const result = await this.redis.ft.search(
      this.INDEX_NAME,
      `@accessToken:${accessToken}`,
    );

    return result.total > 0;
  }

  async deleteByAccessToken(accessToken: string) {
    const result = await this.redis.ft.search(
      this.INDEX_NAME,
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
      this.INDEX_NAME,
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
      this.INDEX_NAME,
      {
        '$.accessToken': { type: SchemaFieldTypes.TEXT, AS: 'accessToken' },
        '$.refreshToken': { type: SchemaFieldTypes.TEXT, AS: 'refreshToken' },
        '$.userId': { type: SchemaFieldTypes.TEXT, AS: 'userId' },
      },
      { ON: 'JSON', PREFIX: this.KEY_PREFIX },
    );
  }

  private async existsIndex() {
    try {
      await this.redis.ft.info(this.INDEX_NAME);
    } catch (error) {
      if (error instanceof ErrorReply) {
        return false;
      }
      throw error;
    }
    return true;
  }

  private makeKey(id: string) {
    return `${this.KEY_PREFIX}${id}`;
  }

  private extractIdFromKey(key: string) {
    return key.slice(this.KEY_PREFIX.length);
  }
}