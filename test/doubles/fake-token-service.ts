import { InvalidTokenError } from '@/application/errors/invalid-token-error';
import {
  DecodedPayload,
  TokenService,
} from '@/application/ports/token-service';
import { Either, left, right } from '@/shared/either';

export class FakeTokenService implements TokenService {
  private readonly accessTokenPrefix = 'ACCESS_TOKEN:';
  private readonly refreshTokenPrefix = 'REFRESH_TOKEN:';

  generateAccessToken(userId: string): Promise<string> {
    return Promise.resolve(
      `${this.accessTokenPrefix}${Math.random()}:${userId}`,
    );
  }

  generateRefreshToken(userId: string): Promise<string> {
    return Promise.resolve(
      `${this.refreshTokenPrefix}${Math.random()}:${userId}`,
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

  isAccessTokenValid(token: string): Promise<boolean> {
    return Promise.resolve(token.includes(this.accessTokenPrefix));
  }

  // eslint-disable-next-line class-methods-use-this
  private decode(
    token: string,
    prefix: string,
  ): Either<InvalidTokenError, DecodedPayload> {
    if (!token.includes(prefix)) {
      return left(new InvalidTokenError());
    }

    const userId = token.split(':')[2];

    return right({ userId });
  }
}
