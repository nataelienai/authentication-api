import { InvalidTokenError } from '@/application/errors/invalid-token-error';
import {
  DecodedPayload,
  TokenService,
} from '@/application/ports/token-service';
import { Either, left, right } from '@/shared/either';

export class FakeTokenService implements TokenService {
  private readonly accessTokenPrefix = 'ACCESS_TOKEN';
  private readonly refreshTokenPrefix = 'REFRESH_TOKEN';

  generateAccessToken(userId: string, sessionId: string): Promise<string> {
    return Promise.resolve(
      `${this.accessTokenPrefix}:${Math.random()}:${userId}:${sessionId}`,
    );
  }

  generateRefreshToken(userId: string, sessionId: string): Promise<string> {
    return Promise.resolve(
      `${this.refreshTokenPrefix}:${Math.random()}:${userId}:${sessionId}`,
    );
  }

  decodeAccessToken(
    token: string,
  ): Promise<Either<InvalidTokenError, DecodedPayload>> {
    return Promise.resolve(this.decode(token, this.accessTokenPrefix));
  }

  decodeRefreshToken(
    token: string,
  ): Promise<Either<InvalidTokenError, DecodedPayload>> {
    return Promise.resolve(this.decode(token, this.refreshTokenPrefix));
  }

  // eslint-disable-next-line class-methods-use-this
  private decode(
    token: string,
    prefix: string,
  ): Either<InvalidTokenError, DecodedPayload> {
    if (!token.includes(prefix)) {
      return left(new InvalidTokenError());
    }

    // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
    const [, , userId, sessionId] = token.split(':');

    return right({ userId, sessionId });
  }
}
