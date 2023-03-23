import { Session } from '@/domain/session';
import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { SessionRepository } from '../ports/session-repository';
import { DecodedPayload, TokenService } from '../ports/token-service';

export class Auth {
  constructor(
    private readonly tokenService: TokenService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async authenticate(
    accessToken: string,
  ): Promise<Either<InvalidTokenError, DecodedPayload>> {
    const [errorOrDecodedPayload, sessionExists] = await Promise.all([
      this.tokenService.decodeAccessToken(accessToken),
      this.sessionRepository.existsByAccessToken(accessToken),
    ]);

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    if (!sessionExists) {
      return left(new InvalidTokenError());
    }

    return right(errorOrDecodedPayload.value);
  }

  async grantAccessToUser(userId: string): Promise<Session> {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(userId),
      this.tokenService.generateRefreshToken(userId),
    ]);

    const session = Session.create({
      accessToken,
      refreshToken,
      userId,
    });

    await this.sessionRepository.create(session);
    return session;
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<Either<InvalidTokenError, Session>> {
    const [errorOrDecodedPayload, session] = await Promise.all([
      this.tokenService.decodeRefreshToken(refreshToken),
      this.sessionRepository.findByRefreshToken(refreshToken),
    ]);

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    if (!session) {
      return left(new InvalidTokenError());
    }

    const { userId } = errorOrDecodedPayload.value;
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(userId),
      this.tokenService.generateRefreshToken(userId),
    ]);

    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;

    await this.sessionRepository.update(session);
    return right(session);
  }

  async revokeAccessToken(
    accessToken: string,
  ): Promise<Either<InvalidTokenError, void>> {
    const [isTokenValid, sessionExists] = await Promise.all([
      this.tokenService.isAccessTokenValid(accessToken),
      this.sessionRepository.existsByAccessToken(accessToken),
    ]);

    if (!isTokenValid || !sessionExists) {
      return left(new InvalidTokenError());
    }

    await this.sessionRepository.deleteByAccessToken(accessToken);

    // eslint-disable-next-line unicorn/no-useless-undefined
    return right(undefined);
  }

  async revokeAccessFromUser(userId: string) {
    await this.sessionRepository.deleteAllByUserId(userId);
  }
}
