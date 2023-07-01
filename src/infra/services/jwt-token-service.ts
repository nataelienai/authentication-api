import jwt from 'jsonwebtoken';
import { InvalidTokenError } from '@/application/errors/invalid-token-error';
import {
  DecodedPayload,
  TokenService,
} from '@/application/ports/token-service';
import { Either, left, right } from '@/shared/either';

export class JwtTokenService implements TokenService {
  private static readonly ACCESS_TOKEN_EXPIRES_IN = '1h';
  private static readonly REFRESH_TOKEN_EXPIRES_IN = '30d';

  constructor(
    private readonly accessTokenSecret: string,
    private readonly refreshTokenSecret: string,
  ) {}

  generateAccessToken(userId: string, sessionId: string) {
    return Promise.resolve(
      JwtTokenService.generateToken(
        userId,
        sessionId,
        this.accessTokenSecret,
        JwtTokenService.ACCESS_TOKEN_EXPIRES_IN,
      ),
    );
  }

  generateRefreshToken(userId: string, sessionId: string) {
    return Promise.resolve(
      JwtTokenService.generateToken(
        userId,
        sessionId,
        this.refreshTokenSecret,
        JwtTokenService.REFRESH_TOKEN_EXPIRES_IN,
      ),
    );
  }

  decodeAccessToken(
    token: string,
  ): Promise<Either<InvalidTokenError, DecodedPayload>> {
    return Promise.resolve(
      JwtTokenService.decodeToken(token, this.accessTokenSecret),
    );
  }

  decodeRefreshToken(
    token: string,
  ): Promise<Either<InvalidTokenError, DecodedPayload>> {
    return Promise.resolve(
      JwtTokenService.decodeToken(token, this.refreshTokenSecret),
    );
  }

  private static generateToken(
    userId: string,
    sessionId: string,
    secret: string,
    expiresIn: string,
  ) {
    return jwt.sign({ sessionId }, secret, {
      subject: userId,
      expiresIn,
    });
  }

  private static decodeToken(
    token: string,
    secret: string,
  ): Either<InvalidTokenError, DecodedPayload> {
    let jwtPayload;

    try {
      jwtPayload = jwt.verify(token, secret);
    } catch {
      return left(new InvalidTokenError());
    }

    if (
      !(jwtPayload instanceof Object) ||
      !jwtPayload.sub ||
      typeof jwtPayload.sessionId !== 'string'
    ) {
      return left(new InvalidTokenError());
    }

    return right({ userId: jwtPayload.sub, sessionId: jwtPayload.sessionId });
  }
}
