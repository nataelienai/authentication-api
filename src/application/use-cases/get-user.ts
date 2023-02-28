import { User } from '@/domain/user';
import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
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
  ) {}

  async execute(
    request: GetUserRequest,
  ): Promise<Either<InvalidTokenError | UserNotFoundError, GetUserResponse>> {
    const errorOrUserId = await this.tokenService.decode(request.token);

    if (errorOrUserId.isLeft()) {
      return left(errorOrUserId.value);
    }

    const userId = errorOrUserId.value;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError(`User with id '${userId}' not found`));
    }

    return right({ user });
  }
}
