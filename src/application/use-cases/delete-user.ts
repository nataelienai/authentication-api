import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { SessionRepository } from '../ports/session-repository';
import { TokenService } from '../ports/token-service';
import { UserRepository } from '../ports/user-repository';

export type DeleteUserRequest = {
  accessToken: string;
};

export class DeleteUser {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(
    request: DeleteUserRequest,
  ): Promise<Either<InvalidTokenError | UserNotFoundError, void>> {
    const errorOrDecodedPayload = await this.tokenService.decodeAccessToken(
      request.accessToken,
    );

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    const sessionExists = await this.sessionRepository.existsByAccessToken(
      request.accessToken,
    );

    if (!sessionExists) {
      return left(new InvalidTokenError());
    }

    const { userId } = errorOrDecodedPayload.value;
    const userExists = await this.userRepository.existsById(userId);

    if (!userExists) {
      return left(new UserNotFoundError(`User with id '${userId}' not found`));
    }

    await Promise.all([
      this.userRepository.deleteById(userId),
      this.sessionRepository.deleteAllByUserId(userId),
    ]);

    return right(undefined);
  }
}
