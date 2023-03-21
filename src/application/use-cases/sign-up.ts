import { Email } from '@/domain/email';
import { InvalidEmailError } from '@/domain/errors/invalid-email-error';
import { InvalidPasswordError } from '@/domain/errors/invalid-password-error';
import { InvalidTimestampsError } from '@/domain/errors/invalid-timestamps-error';
import { Password } from '@/domain/password';
import { Session } from '@/domain/session';
import { User } from '@/domain/user';
import { Either, left, right } from '@/shared/either';
import { EmailAlreadyExistsError } from '../errors/email-already-exists-error';
import { PasswordHasher } from '../ports/password-hasher';
import { UserRepository } from '../ports/user-repository';
import { Auth } from './auth';

export type SignUpRequest = {
  email: string;
  password: string;
};

export type SignUpResponse = {
  user: User;
  session: Session;
};

export class SignUp {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly userRepository: UserRepository,
    private readonly auth: Auth,
  ) {}

  async execute(
    request: SignUpRequest,
  ): Promise<
    Either<
      | InvalidEmailError
      | InvalidPasswordError
      | InvalidTimestampsError
      | EmailAlreadyExistsError,
      SignUpResponse
    >
  > {
    const errorOrEmail = Email.create(request.email);
    const errorOrPassword = Password.create(request.password);

    if (errorOrEmail.isLeft()) {
      return left(errorOrEmail.value);
    }

    if (errorOrPassword.isLeft()) {
      return left(errorOrPassword.value);
    }

    const email = errorOrEmail.value;
    const password = errorOrPassword.value;
    const hashedPassword = await this.passwordHasher.hash(password);
    const errorOrUser = User.create({ email, hashedPassword });

    if (errorOrUser.isLeft()) {
      return left(errorOrUser.value);
    }

    const user = errorOrUser.value;
    const emailAlreadyExists = await this.userRepository.existsByEmail(
      user.email.value,
    );

    if (emailAlreadyExists) {
      return left(new EmailAlreadyExistsError(user.email.value));
    }

    await this.userRepository.create(user);

    const session = await this.auth.grantAccessToUser(user.id);

    return right({ user, session });
  }
}
