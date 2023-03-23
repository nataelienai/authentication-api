import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserRepository } from '../ports/user-repository';
import { Auth } from './auth';

export type DeleteUserRequest = {
  accessToken: string;
};

export class DeleteUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auth: Auth,
  ) {}

  async execute(
    request: DeleteUserRequest,
  ): Promise<Either<InvalidTokenError | UserNotFoundError, void>> {
    const errorOrDecodedPayload = await this.auth.authenticate(
      request.accessToken,
    );

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    const { userId } = errorOrDecodedPayload.value;
    const userExists = await this.userRepository.existsById(userId);

    if (!userExists) {
      return left(new UserNotFoundError(`User with id '${userId}' not found`));
    }

    await Promise.all([
      this.userRepository.deleteById(userId),
      this.auth.revokeAccessFromUser(userId),
    ]);

    // eslint-disable-next-line unicorn/no-useless-undefined
    return right(undefined);
  }
}
