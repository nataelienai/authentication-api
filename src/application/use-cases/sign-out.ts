import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { BlacklistedTokenRepository } from '../ports/blacklisted-token-repository';
import { TokenService } from '../ports/token-service';

type SignOutRequest = {
  token: string;
};

export class SignOut {
  constructor(
    private readonly tokenService: TokenService,
    private readonly blacklistedTokenRepository: BlacklistedTokenRepository,
  ) {}

  async execute({
    token,
  }: SignOutRequest): Promise<Either<InvalidTokenError, void>> {
    const errorOrDecodedPayload = await this.tokenService.decode(token);

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    const isTokenBlacklisted = await this.blacklistedTokenRepository.exists(
      token,
    );

    if (isTokenBlacklisted) {
      return left(new InvalidTokenError());
    }

    const { tokenExpiration } = errorOrDecodedPayload.value;
    await this.blacklistedTokenRepository.create({ token, tokenExpiration });

    return right(undefined);
  }
}
