import { User } from '@/domain/user';
import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserRepository } from '../ports/user-repository';
import { Auth } from './auth';

export type GetUserRequest = {
  accessToken: string;
};

export type GetUserResponse = {
  user: User;
};

export class GetUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auth: Auth,
  ) {}

  async execute(
    request: GetUserRequest,
  ): Promise<Either<InvalidTokenError | UserNotFoundError, GetUserResponse>> {
    const errorOrDecodedPayload = await this.auth.authenticate(
      request.accessToken,
    );

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    const { userId } = errorOrDecodedPayload.value;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError(`User with id '${userId}' not found`));
    }

    return right({ user });
  }
}
