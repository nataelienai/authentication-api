import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { SessionRepository } from '../ports/session-repository';
import { TokenService } from '../ports/token-service';

export type SignOutRequest = {
  accessToken: string;
};

export class SignOut {
  constructor(
    private readonly tokenService: TokenService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(
    request: SignOutRequest,
  ): Promise<Either<InvalidTokenError, void>> {
    const isTokenValid = await this.tokenService.isAccessTokenValid(
      request.accessToken,
    );

    if (!isTokenValid) {
      return left(new InvalidTokenError());
    }

    const sessionExists = await this.sessionRepository.existsByAccessToken(
      request.accessToken,
    );

    if (!sessionExists) {
      return left(new InvalidTokenError());
    }

    await this.sessionRepository.deleteByAccessToken(request.accessToken);

    return right(undefined);
  }
}
