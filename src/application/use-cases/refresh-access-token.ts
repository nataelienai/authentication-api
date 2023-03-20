import { Session } from '@/domain/session';
import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { SessionRepository } from '../ports/session-repository';
import { TokenService } from '../ports/token-service';

export type RefreshAccessTokenRequest = {
  refreshToken: string;
};

export type RefreshAccessTokenResponse = {
  session: Session;
};

export class RefreshAccessToken {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    request: RefreshAccessTokenRequest,
  ): Promise<Either<InvalidTokenError, RefreshAccessTokenResponse>> {
    const [errorOrDecodedPayload, session] = await Promise.all([
      this.tokenService.decodeRefreshToken(request.refreshToken),
      this.sessionRepository.findByRefreshToken(request.refreshToken),
    ]);

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    if (!session) {
      return left(new InvalidTokenError());
    }

    const { userId } = errorOrDecodedPayload.value;
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(userId),
      this.tokenService.generateRefreshToken(userId),
    ]);

    session.accessToken = accessToken;
    session.refreshToken = refreshToken;

    await this.sessionRepository.update(session);

    return right({ session });
  }
}
