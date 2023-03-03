import { User } from '@/domain/user';
import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { SessionRepository } from '../ports/session-repository';
import { TokenService } from '../ports/token-service';
import { UserRepository } from '../ports/user-repository';

type GetUserRequest = {
  token: string;
};

type GetUserResponse = {
  user: User;
};

export class GetUser {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(
    request: GetUserRequest,
  ): Promise<Either<InvalidTokenError | UserNotFoundError, GetUserResponse>> {
    const errorOrDecodedPayload = await this.tokenService.decode(request.token);

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    const sessionExists = await this.sessionRepository.exists(request.token);

    if (!sessionExists) {
      return left(new InvalidTokenError());
    }

    const { userId } = errorOrDecodedPayload.value;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError(`User with id '${userId}' not found`));
    }

    return right({ user });
  }
}
