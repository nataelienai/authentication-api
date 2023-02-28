import { Email } from '@/domain/email';
import { InvalidEmailError } from '@/domain/errors/invalid-email-error';
import { User } from '@/domain/user';
import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { TokenService } from '../ports/token-service';
import { UserRepository } from '../ports/user-repository';

type ChangeEmailRequest = {
  token: string;
  email: string;
};

type ChangeEmailResponse = {
  user: User;
};

export class ChangeEmail {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    request: ChangeEmailRequest,
  ): Promise<
    Either<
      InvalidTokenError | UserNotFoundError | InvalidEmailError,
      ChangeEmailResponse
    >
  > {
    const errorOrUserId = await this.tokenService.decode(request.token);

    if (errorOrUserId.isLeft()) {
      return left(errorOrUserId.value);
    }

    const userId = errorOrUserId.value;
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
