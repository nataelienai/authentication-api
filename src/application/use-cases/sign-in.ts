import { Session } from '@/domain/session';
import { User } from '@/domain/user';
import { Either, left, right } from '@/shared/either';
import { IncorrectPasswordError } from '../errors/incorrect-password-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { PasswordHasher } from '../ports/password-hasher';
import { UserRepository } from '../ports/user-repository';
import { Auth } from './auth';

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponse = {
  user: User;
  session: Session;
};

export class SignIn {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly userRepository: UserRepository,
    private readonly auth: Auth,
  ) {}

  async execute(
    request: SignInRequest,
  ): Promise<
    Either<UserNotFoundError | IncorrectPasswordError, SignInResponse>
  > {
    const user = await this.userRepository.findByEmail(request.email);

    if (!user) {
      return left(
        new UserNotFoundError(`User with email '${request.email}' not found`),
      );
    }

    const isPasswordCorrect = await this.passwordHasher.compare(
      request.password,
      user.hashedPassword,
    );

    if (!isPasswordCorrect) {
      return left(new IncorrectPasswordError());
    }

    const session = await this.auth.grantAccessToUser(user.id);

    return right({ user, session });
  }
}
