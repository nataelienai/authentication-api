import { FakePasswordHasher } from '@test/doubles/fake-password-hasher';
import { FakeTokenService } from '@test/doubles/fake-token-service';
import { InMemorySessionRepository } from '@test/doubles/in-memory-session-repository';
import { InMemoryUserRepository } from '@test/doubles/in-memory-user-repository';
import { Email } from '@/domain/email';
import { Password } from '@/domain/password';
import { Session } from '@/domain/session';
import { User } from '@/domain/user';
import { InvalidPasswordError } from '@/domain/errors/invalid-password-error';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { PasswordHasher } from '../ports/password-hasher';
import { SessionRepository } from '../ports/session-repository';
import { TokenService } from '../ports/token-service';
import { UserRepository } from '../ports/user-repository';
import { Auth } from './auth';
import { ChangePassword, ChangePasswordResponse } from './change-password';

describe('Change Password', () => {
  let passwordHasher: PasswordHasher;
  let userRepository: UserRepository;
  let tokenService: TokenService;
  let sessionRepository: SessionRepository;
  let auth: Auth;
  let changePassword: ChangePassword;

  beforeEach(() => {
    passwordHasher = new FakePasswordHasher();
    userRepository = new InMemoryUserRepository();
    tokenService = new FakeTokenService();
    sessionRepository = new InMemorySessionRepository();
    auth = new Auth(tokenService, sessionRepository);
    changePassword = new ChangePassword(userRepository, passwordHasher, auth);
  });

  test('When access token is invalid, return an error', async () => {
    // Arrange
    // Act
    const errorOrResponse = await changePassword.execute({
      accessToken: 'invalid_token',
      password: 'new_password',
    });

    // Assert
    expect(errorOrResponse.isLeft()).toBe(true);
    expect(errorOrResponse.value).toBeInstanceOf(InvalidTokenError);
  });

  test('When user is not found, return an error', async () => {
    // Arrange
    const userId = 'fake_id';
    const sessionId = 'fake_session_id';
    const [accessToken, refreshToken] = await Promise.all([
      tokenService.generateAccessToken(userId, sessionId),
      tokenService.generateRefreshToken(userId, sessionId),
    ]);
    const session = Session.create({
      id: sessionId,
      accessToken,
      refreshToken,
      userId,
    });
    await sessionRepository.create(session);

    // Act
    const errorOrResponse = await changePassword.execute({
      accessToken,
      password: 'new_password',
    });

    // Assert
    expect(errorOrResponse.isLeft()).toBe(true);
    expect(errorOrResponse.value).toBeInstanceOf(UserNotFoundError);
  });

  test('When password is invalid, return an error', async () => {
    // Arrange
    const user = User.create({
      email: Email.create('valid@email.com').value as Email,
      hashedPassword: await passwordHasher.hash(
        Password.create('password123').value as Password,
      ),
    }).value as User;
    await userRepository.create(user);

    const sessionId = Session.generateId();
    const [accessToken, refreshToken] = await Promise.all([
      tokenService.generateAccessToken(user.id, sessionId),
      tokenService.generateRefreshToken(user.id, sessionId),
    ]);
    const session = Session.create({
      id: sessionId,
      accessToken,
      refreshToken,
      userId: user.id,
    });
    await sessionRepository.create(session);

    // Act
    const errorOrResponse = await changePassword.execute({
      accessToken,
      password: 'short',
    });

    // Assert
    expect(errorOrResponse.isLeft()).toBe(true);
    expect(errorOrResponse.value).toBeInstanceOf(InvalidPasswordError);
  });

  test('When email and token are valid and user is found, return the user new info', async () => {
    // Arrange
    const user = User.create({
      email: Email.create('valid@email.com').value as Email,
      hashedPassword: await passwordHasher.hash(
        Password.create('password123').value as Password,
      ),
    }).value as User;
    await userRepository.create(user);

    const sessionId = Session.generateId();
    const [accessToken, refreshToken] = await Promise.all([
      tokenService.generateAccessToken(user.id, sessionId),
      tokenService.generateRefreshToken(user.id, sessionId),
    ]);
    const session = Session.create({
      id: sessionId,
      accessToken,
      refreshToken,
      userId: user.id,
    });
    await sessionRepository.create(session);

    const newPassword = 'new_password';

    // Act
    const errorOrResponse = await changePassword.execute({
      accessToken,
      password: newPassword,
    });

    // Assert
    expect(errorOrResponse.isRight()).toBe(true);

    const response = errorOrResponse.value as ChangePasswordResponse;
    const passwordChanged = await passwordHasher.compare(
      newPassword,
      response.user.hashedPassword,
    );
    expect(passwordChanged).toBe(true);
  });
});
