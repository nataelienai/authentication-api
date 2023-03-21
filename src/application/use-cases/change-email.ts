import { Email } from '@/domain/email';
import { InvalidEmailError } from '@/domain/errors/invalid-email-error';
import { User } from '@/domain/user';
import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserRepository } from '../ports/user-repository';
import { Auth } from './auth';

export type ChangeEmailRequest = {
  accessToken: string;
  email: string;
};

export type ChangeEmailResponse = {
  user: User;
};

export class ChangeEmail {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auth: Auth,
  ) {}

  async execute(
    request: ChangeEmailRequest,
  ): Promise<
    Either<
      InvalidTokenError | UserNotFoundError | InvalidEmailError,
      ChangeEmailResponse
    >
  > {
    const errorOrDecodedPlayload = await this.auth.authenticate(
      request.accessToken,
    );

    if (errorOrDecodedPlayload.isLeft()) {
      return left(errorOrDecodedPlayload.value);
    }

    const { userId } = errorOrDecodedPlayload.value;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError(`User with id '${userId}' not found`));
    }

    const errorOrEmail = Email.create(request.email);

    if (errorOrEmail.isLeft()) {
      return left(errorOrEmail.value);
    }

    const updatedEmail = errorOrEmail.value;
    user.email = updatedEmail;

    await this.userRepository.update(user);

    return right({ user });
  }
}
