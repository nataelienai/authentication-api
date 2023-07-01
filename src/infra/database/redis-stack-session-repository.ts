import { Session } from '@/domain/session';
import { ErrorReply, RedisClientType, SchemaFieldTypes } from 'redis';

export class RedisStackSessionRepository {
  private static readonly INDEX_NAME = 'idx:session';
  private static readonly KEY_PREFIX = 'session:';

  private constructor(private readonly redis: RedisClientType) {}

  static async create(redis: RedisClientType) {
    const repository = new RedisStackSessionRepository(redis);
    await repository.createIndex();
    return repository;
  }

  async create(session: Session) {
    await this.redis.json.set(
      RedisStackSessionRepository.makeKey(session.id),
      '$',
      {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        userId: session.userId,
      },
    );
  }

  async update(session: Session) {
    await this.create(session);
  }

  async findByRefreshToken(refreshToken: string): Promise<Session | undefined> {
    const escapedRefreshToken =
      RedisStackSessionRepository.escapeSpecialCharacters(refreshToken);

    const result = await this.redis.ft.search(
      RedisStackSessionRepository.INDEX_NAME,
      `@refreshToken:{${escapedRefreshToken}}`,
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
      id: RedisStackSessionRepository.extractIdFromKey(document.id),
      accessToken: document.value.accessToken,
      refreshToken: document.value.refreshToken,
      userId: document.value.userId,
    });
  }

  async existsByAccessToken(accessToken: string) {
    const escapedAccessToken =
      RedisStackSessionRepository.escapeSpecialCharacters(accessToken);

    const result = await this.redis.ft.search(
      RedisStackSessionRepository.INDEX_NAME,
      `@accessToken:{${escapedAccessToken}}`,
    );

    return result.total > 0;
  }

  async deleteByAccessToken(accessToken: string) {
    const escapedAccessToken =
      RedisStackSessionRepository.escapeSpecialCharacters(accessToken);

    const result = await this.redis.ft.search(
      RedisStackSessionRepository.INDEX_NAME,
      `@accessToken:{${escapedAccessToken}}`,
    );

    if (result.total === 0) {
      return;
    }

    const sessionKey = result.documents[0].id;
    await this.redis.unlink(sessionKey);
  }

  async deleteAllByUserId(userId: string) {
    const escapedUserId =
      RedisStackSessionRepository.escapeSpecialCharacters(userId);

    const result = await this.redis.ft.search(
      RedisStackSessionRepository.INDEX_NAME,
      `@userId:{${escapedUserId}}`,
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
      RedisStackSessionRepository.INDEX_NAME,
      {
        '$.accessToken': {
          type: SchemaFieldTypes.TAG,
          AS: 'accessToken',
          CASESENSITIVE: true,
        },
        '$.refreshToken': {
          type: SchemaFieldTypes.TAG,
          AS: 'refreshToken',
          CASESENSITIVE: true,
        },
        '$.userId': { type: SchemaFieldTypes.TAG, AS: 'userId' },
      },
      { ON: 'JSON', PREFIX: RedisStackSessionRepository.KEY_PREFIX },
    );
  }

  private async existsIndex() {
    try {
      await this.redis.ft.info(RedisStackSessionRepository.INDEX_NAME);
    } catch (error) {
      if (error instanceof ErrorReply) {
        return false;
      }
      throw error;
    }
    return true;
  }

  private static makeKey(id: string) {
    return `${RedisStackSessionRepository.KEY_PREFIX}${id}`;
  }

  private static escapeSpecialCharacters(idOrToken: string) {
    const escapedChars: Record<string, string> = {
      '.': '\\.',
      '-': '\\-',
    };

    // rule disabled because 'char' is a tightly controlled input
    // eslint-disable-next-line security/detect-object-injection
    return idOrToken.replace(/[.-]/g, (char) => escapedChars[char]);
  }

  private static extractIdFromKey(key: string) {
    return key.slice(RedisStackSessionRepository.KEY_PREFIX.length);
  }
}
