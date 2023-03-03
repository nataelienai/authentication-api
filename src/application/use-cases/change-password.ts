import { InvalidPasswordError } from '@/domain/errors/invalid-password-error';
import { Password } from '@/domain/password';
import { User } from '@/domain/user';
import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { SessionRepository } from '../ports/session-repository';
import { PasswordHasher } from '../ports/password-hasher';
import { TokenService } from '../ports/token-service';
import { UserRepository } from '../ports/user-repository';

type ChangePasswordRequest = {
  accessToken: string;
  password: string;
};

type ChangePasswordResponse = {
  user: User;
};

export class ChangePassword {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(
    request: ChangePasswordRequest,
  ): Promise<
    Either<
      InvalidTokenError | UserNotFoundError | InvalidPasswordError,
      ChangePasswordResponse
    >
  > {
    const errorOrDecodedPayload = await this.tokenService.decodeAccessToken(
      request.accessToken,
    );

    if (errorOrDecodedPayload.isLeft()) {
      return left(errorOrDecodedPayload.value);
    }

    const sessionExists = await this.sessionRepository.existsByAccessToken(
      request.accessToken,
    );

    if (!sessionExists) {
      return left(new InvalidTokenError());
    }

    const { userId } = errorOrDecodedPayload.value;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError(`User with id '${userId}' not found`));
    }

    const errorOrPassword = Password.create(request.password);

    if (errorOrPassword.isLeft()) {
      return left(errorOrPassword.value);
    }

    const updatedPassword = errorOrPassword.value;
    const hashedPassword = await this.passwordHasher.hash(updatedPassword);
    user.hashedPassword = hashedPassword;

    await this.userRepository.update(user);

    return right({ user });
  }
}
