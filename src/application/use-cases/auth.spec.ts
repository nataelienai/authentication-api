import { InMemorySessionRepository } from '@test/doubles/in-memory-session-repository';
import { FakeTokenService } from '@test/doubles/fake-token-service';
import { Session } from '@/domain/session';
import { Auth } from './auth';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { TokenService } from '../ports/token-service';
import { SessionRepository } from '../ports/session-repository';

describe('Auth', () => {
  describe('authenticate', () => {
    let tokenService: TokenService;
    let sessionRepository: SessionRepository;
    let auth: Auth;

    beforeEach(() => {
      tokenService = new FakeTokenService();
      sessionRepository = new InMemorySessionRepository();
      auth = new Auth(tokenService, sessionRepository);
    });

    test('When access token decodification fails, should return an error', async () => {
      // Arrange
      const token = 'invalid_token';

      // Act
      const errorOrDecodedPayload = await auth.authenticate(token);

      // Assert
      expect(errorOrDecodedPayload.isLeft()).toBe(true);
      expect(errorOrDecodedPayload.value).toBeInstanceOf(InvalidTokenError);
    });

    test('When session does not exist, should return an error', async () => {
      // Arrange
      const userId = 'abc1234';
      const token = await tokenService.generateAccessToken(userId);

      // Act
      const errorOrDecodedPayload = await auth.authenticate(token);

      // Assert
      expect(errorOrDecodedPayload.isLeft()).toBe(true);
      expect(errorOrDecodedPayload.value).toBeInstanceOf(InvalidTokenError);
    });

    test('When session exists and access token is successfully decoded, should return the decoded payload', async () => {
      // Arrange
      const userId = 'abc1234';
      const [accessToken, refreshToken] = await Promise.all([
        tokenService.generateAccessToken(userId),
        tokenService.generateRefreshToken(userId),
      ]);
      const session = Session.create({ userId, accessToken, refreshToken });
      await sessionRepository.create(session);

      // Act
      const errorOrDecodedPayload = await auth.authenticate(
        session.accessToken,
      );

      // Assert
      expect(errorOrDecodedPayload.isRight()).toBe(true);
      expect(errorOrDecodedPayload.value).toHaveProperty('userId', userId);
    });
  });
});
