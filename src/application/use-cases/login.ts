import { User } from '@/domain/user';
import { Either, left, right } from '@/shared/either';
import { IncorrectPasswordError } from '../errors/incorrect-password-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { PasswordHasher } from '../ports/password-hasher';
import { TokenService } from '../ports/token-service';
import { UserRepository } from '../ports/user-repository';

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  user: User;
  token: string;
};

export class Login {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    request: LoginRequest,
  ): Promise<
    Either<UserNotFoundError | IncorrectPasswordError, LoginResponse>
  > {
    const user = await this.userRepository.findByEmail(request.email);

    if (!user) {
      return left(new UserNotFoundError(request.email));
    }

    const isPasswordCorrect = await this.passwordHasher.compare(
      request.password,
      user.hashedPassword,
    );

    if (!isPasswordCorrect) {
      return left(new IncorrectPasswordError());
    }

    const token = await this.tokenService.encode(user.id);

    return right({ user, token });
  }
}
