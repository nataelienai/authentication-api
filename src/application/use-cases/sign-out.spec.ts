import { FakeTokenService } from '@test/doubles/fake-token-service';
import { InMemorySessionRepository } from '@test/doubles/in-memory-session-repository';
import { Session } from '@/domain/session';
import { SessionRepository } from '../ports/session-repository';
import { TokenService } from '../ports/token-service';
import { Auth } from './auth';
import { SignOut } from './sign-out';
import { InvalidTokenError } from '../errors/invalid-token-error';

describe('Sign Out', () => {
  let tokenService: TokenService;
  let sessionRepository: SessionRepository;
  let auth: Auth;
  let signOut: SignOut;

  beforeEach(() => {
    tokenService = new FakeTokenService();
    sessionRepository = new InMemorySessionRepository();
    auth = new Auth(tokenService, sessionRepository);
    signOut = new SignOut(auth);
  });

  test('When access token is invalid, return an error', async () => {
    // Arrange
    // Act
    const errorOrResponse = await signOut.execute({ accessToken: 'abcd1234' });

    // Assert
    expect(errorOrResponse.isLeft()).toBe(true);
    expect(errorOrResponse.value).toBeInstanceOf(InvalidTokenError);
  });

  test('When token is valid and session exists, deletes session', async () => {
    // Arrange
    const userId = 'fake_id';
    const accessToken = await tokenService.generateAccessToken(userId);
    const refreshToken = await tokenService.generateRefreshToken(userId);
    const session = Session.create({ accessToken, refreshToken, userId });
    await sessionRepository.create(session);

    // Act
    const errorOrResponse = await signOut.execute({ accessToken });

    // Assert
    expect(errorOrResponse.isRight()).toBe(true);
    expect(errorOrResponse.value).toBeUndefined();
  });
});
