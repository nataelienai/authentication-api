import { Session } from '@/domain/session';
import { User } from '@/domain/user';
import { Either, left, right } from '@/shared/either';
import { IncorrectPasswordError } from '../errors/incorrect-password-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { PasswordHasher } from '../ports/password-hasher';
import { SessionRepository } from '../ports/session-repository';
import { TokenService } from '../ports/token-service';
import { UserRepository } from '../ports/user-repository';

type SignInRequest = {
  email: string;
  password: string;
};

type SignInResponse = {
  user: User;
  session: Session;
};

export class SignIn {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly sessionRepository: SessionRepository,
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

    const accessToken = await this.tokenService.generateAccessToken(user.id);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

    const session = Session.create({
      accessToken,
      refreshToken,
      userId: user.id,
    });

    await this.sessionRepository.create(session);

    return right({ user, session });
  }
}
