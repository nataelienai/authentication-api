import jwt from 'jsonwebtoken';
import { InvalidTokenError } from '@/application/errors/invalid-token-error';
import {
  DecodedPayload,
  TokenService,
} from '@/application/ports/token-service';
import { Either, left, right } from '@/shared/either';

export class JwtTokenService implements TokenService {
  constructor(
    private readonly accessTokenSecret: string,
    private readonly refreshTokenSecret: string,
    private readonly accessTokenExpirationInSeconds: number,
    private readonly refreshTokenExpirationInSeconds: number,
  ) {}

  generateAccessToken(userId: string, sessionId: string) {
    return Promise.resolve(
      JwtTokenService.generateToken(
        userId,
        sessionId,
        this.accessTokenSecret,
        this.accessTokenExpirationInSeconds,
      ),
    );
  }

  generateRefreshToken(userId: string, sessionId: string) {
    return Promise.resolve(
      JwtTokenService.generateToken(
        userId,
        sessionId,
        this.refreshTokenSecret,
        this.refreshTokenExpirationInSeconds,
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
    expirationInSeconds: number,
  ) {
    return jwt.sign({ sessionId }, secret, {
      subject: userId,
      expiresIn: expirationInSeconds,
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
