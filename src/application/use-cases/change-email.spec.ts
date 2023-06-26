import { FakePasswordHasher } from '@test/doubles/fake-password-hasher';
import { FakeTokenService } from '@test/doubles/fake-token-service';
import { InMemorySessionRepository } from '@test/doubles/in-memory-session-repository';
import { InMemoryUserRepository } from '@test/doubles/in-memory-user-repository';
import { Email } from '@/domain/email';
import { Password } from '@/domain/password';
import { Session } from '@/domain/session';
import { User } from '@/domain/user';
import { InvalidEmailError } from '@/domain/errors/invalid-email-error';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { PasswordHasher } from '../ports/password-hasher';
import { SessionRepository } from '../ports/session-repository';
import { TokenService } from '../ports/token-service';
import { UserRepository } from '../ports/user-repository';
import { Auth } from './auth';
import { ChangeEmail } from './change-email';

const VALID_EMAIL = 'valid@email.com';

describe('Change Email', () => {
  let passwordHasher: PasswordHasher;
  let userRepository: UserRepository;
  let tokenService: TokenService;
  let sessionRepository: SessionRepository;
  let auth: Auth;
  let changeEmail: ChangeEmail;

  beforeEach(() => {
    passwordHasher = new FakePasswordHasher();
    userRepository = new InMemoryUserRepository();
    tokenService = new FakeTokenService();
    sessionRepository = new InMemorySessionRepository();
    auth = new Auth(tokenService, sessionRepository);
    changeEmail = new ChangeEmail(userRepository, auth);
  });

  test('When access token is invalid, return an error', async () => {
    // Arrange
    // Act
    const errorOrResponse = await changeEmail.execute({
      accessToken: 'invalid_token',
      email: VALID_EMAIL,
    });

    // Assert
    expect(errorOrResponse.isLeft()).toBe(true);
    expect(errorOrResponse.value).toBeInstanceOf(InvalidTokenError);
  });

  test('When user is not found, return an error', async () => {
    // Arrange
    const userId = 'fake_id';
    const accessToken = await tokenService.generateAccessToken(userId);
    const refreshToken = await tokenService.generateRefreshToken(userId);
    const session = Session.create({ accessToken, refreshToken, userId });
    await sessionRepository.create(session);

    // Act
    const errorOrResponse = await changeEmail.execute({
      accessToken,
      email: VALID_EMAIL,
    });

    // Assert
    expect(errorOrResponse.isLeft()).toBe(true);
    expect(errorOrResponse.value).toBeInstanceOf(UserNotFoundError);
  });

  test('When email is invalid, return an error', async () => {
    // Arrange
    const user = User.create({
      email: Email.create(VALID_EMAIL).value as Email,
      hashedPassword: await passwordHasher.hash(
        Password.create('password123').value as Password,
      ),
    }).value as User;
    await userRepository.create(user);

    const accessToken = await tokenService.generateAccessToken(user.id);
    const refreshToken = await tokenService.generateRefreshToken(user.id);
    const session = Session.create({
      accessToken,
      refreshToken,
      userId: user.id,
    });
    await sessionRepository.create(session);

    // Act
    const errorOrResponse = await changeEmail.execute({
      accessToken,
      email: 'invalid_email',
    });

    // Assert
    expect(errorOrResponse.isLeft()).toBe(true);
    expect(errorOrResponse.value).toBeInstanceOf(InvalidEmailError);
  });

  test('When email and token are valid and user is found, return the user new info', async () => {
    // Arrange
    const user = User.create({
      email: Email.create(VALID_EMAIL).value as Email,
      hashedPassword: await passwordHasher.hash(
        Password.create('password123').value as Password,
      ),
    }).value as User;
    await userRepository.create(user);

    const accessToken = await tokenService.generateAccessToken(user.id);
    const refreshToken = await tokenService.generateRefreshToken(user.id);
    const session = Session.create({
      accessToken,
      refreshToken,
      userId: user.id,
    });
    await sessionRepository.create(session);

    const newEmail = 'new_valid@email.com';

    // Act
    const errorOrResponse = await changeEmail.execute({
      accessToken,
      email: newEmail,
    });

    // Assert
    expect(errorOrResponse.isRight()).toBe(true);
    expect(errorOrResponse.value).toHaveProperty('user.email.value', newEmail);
  });
});
