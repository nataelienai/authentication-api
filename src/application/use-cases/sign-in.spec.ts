import { FakePasswordHasher } from '@test/doubles/fake-password-hasher';
import { InMemoryUserRepository } from '@test/doubles/in-memory-user-repository';
import { FakeTokenService } from '@test/doubles/fake-token-service';
import { InMemorySessionRepository } from '@test/doubles/in-memory-session-repository';
import { User } from '@/domain/user';
import { Email } from '@/domain/email';
import { Password } from '@/domain/password';
import { Auth } from './auth';
import { SignIn } from './sign-in';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { PasswordHasher } from '../ports/password-hasher';
import { UserRepository } from '../ports/user-repository';
import { TokenService } from '../ports/token-service';
import { SessionRepository } from '../ports/session-repository';
import { IncorrectPasswordError } from '../errors/incorrect-password-error';

const VALID_EMAIL = 'user@email.com';

describe('Sign In', () => {
  let passwordHasher: PasswordHasher;
  let userRepository: UserRepository;
  let tokenService: TokenService;
  let sessionRepository: SessionRepository;
  let auth: Auth;
  let signIn: SignIn;

  beforeEach(() => {
    passwordHasher = new FakePasswordHasher();
    userRepository = new InMemoryUserRepository();
    tokenService = new FakeTokenService();
    sessionRepository = new InMemorySessionRepository();
    auth = new Auth(tokenService, sessionRepository);
    signIn = new SignIn(passwordHasher, userRepository, auth);
  });

  test('When user is not found, return an error', async () => {
    // Arrange
    // Act
    const errorOrResponse = await signIn.execute({
      email: VALID_EMAIL,
      password: 'password123',
    });

    // Assert
    expect(errorOrResponse.isLeft()).toBe(true);
    expect(errorOrResponse.value).toBeInstanceOf(UserNotFoundError);
  });

  test('When password is incorrect, return an error', async () => {
    // Arrange
    const user = User.create({
      email: Email.create(VALID_EMAIL).value as Email,
      hashedPassword: await passwordHasher.hash(
        Password.create('password123').value as Password,
      ),
    }).value as User;
    await userRepository.create(user);

    // Act
    const errorOrResponse = await signIn.execute({
      email: user.email.value,
      password: 'password1234',
    });

    // Assert
    expect(errorOrResponse.isLeft()).toBe(true);
    expect(errorOrResponse.value).toBeInstanceOf(IncorrectPasswordError);
  });

  test('When email and password are correct, return response with user and session', async () => {
    // Arrange
    const user = User.create({
      email: Email.create(VALID_EMAIL).value as Email,
      hashedPassword: await passwordHasher.hash(
        Password.create('password123').value as Password,
      ),
    }).value as User;
    await userRepository.create(user);

    // Act
    const errorOrResponse = await signIn.execute({
      email: user.email.value,
      password: 'password123',
    });

    // Assert
    expect(errorOrResponse.isRight()).toBe(true);
    expect(errorOrResponse.value).toHaveProperty('user', user);
    expect(errorOrResponse.value).toHaveProperty('session');
  });
});
