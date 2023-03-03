import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { SessionRepository } from '../ports/session-repository';
import { TokenService } from '../ports/token-service';

type SignOutRequest = {
  token: string;
};

export class SignOut {
  constructor(
    private readonly tokenService: TokenService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute({
    token,
  }: SignOutRequest): Promise<Either<InvalidTokenError, void>> {
    const errorOrDecodedPayload = await this.tokenService.decode(token);

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    const sessionExists = await this.sessionRepository.existsByAccessToken(
      token,
    );

    if (!sessionExists) {
      return left(new InvalidTokenError());
    }

    const { tokenExpiration } = errorOrDecodedPayload.value;
    await this.sessionRepository.create({ token, tokenExpiration });

    return right(undefined);
  }
}
