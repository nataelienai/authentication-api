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

  async generateAccessToken(userId: string) {
    return JwtTokenService.generateToken(
      userId,
      this.accessTokenSecret,
      JwtTokenService.ACCESS_TOKEN_EXPIRES_IN,
    );
  }

  async generateRefreshToken(userId: string) {
    return JwtTokenService.generateToken(
      userId,
      this.refreshTokenSecret,
      JwtTokenService.REFRESH_TOKEN_EXPIRES_IN,
    );
  }

  async decodeAccessToken(
    token: string,
  ): Promise<Either<InvalidTokenError, DecodedPayload>> {
    return Promise.resolve(
      JwtTokenService.decodeToken(token, this.accessTokenSecret),
    );
  }

  async decodeRefreshToken(
    token: string,
  ): Promise<Either<InvalidTokenError, DecodedPayload>> {
    return Promise.resolve(
      JwtTokenService.decodeToken(token, this.refreshTokenSecret),
    );
  }

  async isAccessTokenValid(token: string) {
    const errorOrDecodedPayload = await this.decodeAccessToken(token);
    return errorOrDecodedPayload.isRight();
  }

  private static async generateToken(
    userId: string,
    secret: string,
    expiresIn: string,
  ) {
    const token = jwt.sign({}, secret, {
      subject: userId,
      expiresIn,
    });

    return Promise.resolve(token);
  }

  private static decodeToken(
    token: string,
    secret: string,
  ): Either<InvalidTokenError, DecodedPayload> {
    let jwtPayload;

    try {
      jwtPayload = jwt.verify(token, secret);
    } catch (e) {
      return left(new InvalidTokenError());
    }

    if (!(jwtPayload instanceof Object) || !jwtPayload.sub) {
      return left(new InvalidTokenError());
    }

    return right({ userId: jwtPayload.sub });
  }
}