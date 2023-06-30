import { FakeTokenService } from '@test/doubles/fake-token-service';
import { InMemorySessionRepository } from '@test/doubles/in-memory-session-repository';
import { Session } from '@/domain/session';
import { SessionRepository } from '../ports/session-repository';
import { TokenService } from '../ports/token-service';
import { Auth } from './auth';
import { RefreshAccessToken } from './refresh-access-token';
import { InvalidTokenError } from '../errors/invalid-token-error';

describe('Refresh Access Token', () => {
  let tokenService: TokenService;
  let sessionRepository: SessionRepository;
  let auth: Auth;
  let refreshAccessToken: RefreshAccessToken;

  beforeEach(() => {
    tokenService = new FakeTokenService();
    sessionRepository = new InMemorySessionRepository();
    auth = new Auth(tokenService, sessionRepository);
    refreshAccessToken = new RefreshAccessToken(auth);
  });

  test('When refresh token is invalid, return an error', async () => {
    // Arrange
    // Act
    const errorOrResponse = await refreshAccessToken.execute({
      refreshToken: 'abcd1234',
    });

    // Assert
    expect(errorOrResponse.isLeft()).toBe(true);
    expect(errorOrResponse.value).toBeInstanceOf(InvalidTokenError);
  });

  test('When refresh token is valid, return session with new access and refresh tokens', async () => {
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
    const errorOrResponse = await refreshAccessToken.execute({ refreshToken });

    // Assert
    expect(errorOrResponse.isRight()).toBe(true);
    expect(errorOrResponse.value).toHaveProperty('session.id', session.id);
    expect(errorOrResponse.value).toHaveProperty('session.userId', userId);
    expect(errorOrResponse.value).not.toHaveProperty(
      'session.accessToken',
      accessToken,
    );
    expect(errorOrResponse.value).not.toHaveProperty(
      'session.refreshToken',
      refreshToken,
    );
  });
});
