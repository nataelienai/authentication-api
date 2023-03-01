import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { BlacklistedTokenRepository } from '../ports/blacklisted-token-repository';
import { TokenService } from '../ports/token-service';
import { UserRepository } from '../ports/user-repository';

type DeleteUserRequest = {
  token: string;
};

export class DeleteUser {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly blacklistedTokenRepository: BlacklistedTokenRepository,
  ) {}

  async execute(
    request: DeleteUserRequest,
  ): Promise<Either<InvalidTokenError | UserNotFoundError, void>> {
    const errorOrDecodedPayload = await this.tokenService.decode(request.token);

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    const isTokenBlacklisted = await this.blacklistedTokenRepository.exists(
      request.token,
    );

    if (isTokenBlacklisted) {
      return left(new InvalidTokenError());
    }

    const { userId } = errorOrDecodedPayload.value;
    const userExists = await this.userRepository.existsById(userId);

    if (!userExists) {
      return left(new UserNotFoundError(`User with id '${userId}' not found`));
    }

    await this.userRepository.deleteById(userId);

    return right(undefined);
  }
}
