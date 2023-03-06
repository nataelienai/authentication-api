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
import { SessionRepository } from '../ports/session-repository';
import { TokenService } from '../ports/token-service';
import { UserRepository } from '../ports/user-repository';

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
    private readonly tokenService: TokenService,
    private readonly sessionRepository: SessionRepository,
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

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(user.id),
      this.tokenService.generateRefreshToken(user.id),
    ]);

    const session = Session.create({
      accessToken,
      refreshToken,
      userId: user.id,
    });

    await this.sessionRepository.create(session);

    return right({ user, session });
  }
}
