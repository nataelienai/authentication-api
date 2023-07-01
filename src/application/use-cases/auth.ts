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
    const errorOrDecodedPayload = await this.tokenService.decodeAccessToken(
      accessToken,
    );

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    const { sessionId } = errorOrDecodedPayload.value;
    const sessionExists = await this.sessionRepository.existsById(sessionId);

    if (!sessionExists) {
      return left(new InvalidTokenError());
    }

    return right(errorOrDecodedPayload.value);
  }

  async grantAccessToUser(userId: string): Promise<Session> {
    const sessionId = Session.generateId();

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(userId, sessionId),
      this.tokenService.generateRefreshToken(userId, sessionId),
    ]);

    const session = Session.create({
      id: sessionId,
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
    const errorOrDecodedPayload = await this.tokenService.decodeRefreshToken(
      refreshToken,
    );

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    const { userId, sessionId } = errorOrDecodedPayload.value;
    const session = await this.sessionRepository.findById(sessionId);

    if (!session) {
      return left(new InvalidTokenError());
    }

    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(userId, sessionId),
      this.tokenService.generateRefreshToken(userId, sessionId),
    ]);

    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;

    await this.sessionRepository.update(session);
    return right(session);
  }

  async revokeAccessToken(
    accessToken: string,
  ): Promise<Either<InvalidTokenError, void>> {
    const errorOrDecodedPayload = await this.tokenService.decodeAccessToken(
      accessToken,
    );

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    const { sessionId } = errorOrDecodedPayload.value;
    const sessionExists = await this.sessionRepository.existsById(sessionId);

    if (!sessionExists) {
      return left(new InvalidTokenError());
    }

    await this.sessionRepository.deleteById(sessionId);

    // eslint-disable-next-line unicorn/no-useless-undefined
    return right(undefined);
  }

  async revokeAccessFromUser(userId: string) {
    await this.sessionRepository.deleteAllByUserId(userId);
  }
}
