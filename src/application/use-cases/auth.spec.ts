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
      const token = await tokenService.generateAccessToken(userId, '1234abc');

      // Act
      const errorOrDecodedPayload = await auth.authenticate(token);

      // Assert
      expect(errorOrDecodedPayload.isLeft()).toBe(true);
      expect(errorOrDecodedPayload.value).toBeInstanceOf(InvalidTokenError);
    });

    test('When session exists and access token is successfully decoded, should return the user session', async () => {
      // Arrange
      const userId = 'abc1234';
      const sessionId = Session.generateId();
      const [accessToken, refreshToken] = await Promise.all([
        tokenService.generateAccessToken(userId, sessionId),
        tokenService.generateRefreshToken(userId, sessionId),
      ]);
      const session = Session.create({
        id: sessionId,
        userId,
        accessToken,
        refreshToken,
      });
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

  describe('grantAccessToUser', () => {
    test('should return the user session', async () => {
      // Arrange
      const tokenService = new FakeTokenService();
      const sessionRepository = new InMemorySessionRepository();
      const auth = new Auth(tokenService, sessionRepository);
      const userId = 'abc1234';

      // Act
      const session = await auth.grantAccessToUser(userId);

      // Assert
      expect(session.accessToken.length).toBeGreaterThan(0);
      expect(session.refreshToken.length).toBeGreaterThan(0);
      expect(session.userId).toEqual(userId);
    });
  });

  describe('refreshAccessToken', () => {
    let tokenService: TokenService;
    let sessionRepository: SessionRepository;
    let auth: Auth;

    beforeEach(() => {
      tokenService = new FakeTokenService();
      sessionRepository = new InMemorySessionRepository();
      auth = new Auth(tokenService, sessionRepository);
    });

    test('When refresh token decodification fails, should return an error', async () => {
      // Arrange
      const refreshToken = 'invalid_token';

      // Act
      const errorOrDecodedPayload = await auth.refreshAccessToken(refreshToken);

      // Assert
      expect(errorOrDecodedPayload.isLeft()).toBe(true);
      expect(errorOrDecodedPayload.value).toBeInstanceOf(InvalidTokenError);
    });

    test('When session does not exist, should return an error', async () => {
      // Arrange
      const refreshToken = await tokenService.generateRefreshToken(
        'abc1234',
        '1234abc',
      );

      // Act
      const errorOrDecodedPayload = await auth.refreshAccessToken(refreshToken);

      // Assert
      expect(errorOrDecodedPayload.isLeft()).toBe(true);
      expect(errorOrDecodedPayload.value).toBeInstanceOf(InvalidTokenError);
    });

    test('When session exists and refresh token is successfully, should return the new user session', async () => {
      // Arrange
      const userId = 'abc1234';
      const sessionId = Session.generateId();
      const [accessToken, refreshToken] = await Promise.all([
        tokenService.generateAccessToken(userId, sessionId),
        tokenService.generateRefreshToken(userId, sessionId),
      ]);
      const session = Session.create({
        id: sessionId,
        userId,
        accessToken,
        refreshToken,
      });
      await sessionRepository.create(session);

      // Act
      const errorOrDecodedPayload = await auth.refreshAccessToken(refreshToken);

      // Assert
      expect(errorOrDecodedPayload.isRight()).toBe(true);
      expect(errorOrDecodedPayload.value).toHaveProperty('userId', userId);
    });
  });

  describe('revokeAccessToken', () => {
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
      const errorOrDecodedPayload = await auth.revokeAccessToken(token);

      // Assert
      expect(errorOrDecodedPayload.isLeft()).toBe(true);
      expect(errorOrDecodedPayload.value).toBeInstanceOf(InvalidTokenError);
    });

    test('When access token does not exist, should return an error', async () => {
      // Arrange
      const token = await tokenService.generateAccessToken(
        'abc1234',
        '1234abc',
      );

      // Act
      const errorOrDecodedPayload = await auth.revokeAccessToken(token);

      // Assert
      expect(errorOrDecodedPayload.isLeft()).toBe(true);
      expect(errorOrDecodedPayload.value).toBeInstanceOf(InvalidTokenError);
    });

    test('When and access token exists and is successfully decoded, should delete user session', async () => {
      // Arrange
      const userId = 'abc1234';
      const sessionId = Session.generateId();
      const [accessToken, refreshToken] = await Promise.all([
        tokenService.generateAccessToken(userId, sessionId),
        tokenService.generateRefreshToken(userId, sessionId),
      ]);
      const session = Session.create({
        id: sessionId,
        userId,
        accessToken,
        refreshToken,
      });
      await sessionRepository.create(session);

      // Act
      const errorOrVoid = await auth.revokeAccessToken(accessToken);

      // Assert
      expect(errorOrVoid.isRight()).toBe(true);
      expect(errorOrVoid.value).toBeUndefined();
    });
  });

  describe('revokeAccessFromUser', () => {
    test('should delete all sessions for given user', async () => {
      // Arrange
      const tokenService = new FakeTokenService();
      const sessionRepository = new InMemorySessionRepository();
      const auth = new Auth(tokenService, sessionRepository);

      const userId = 'abc1234';
      const sessionId = Session.generateId();
      const [accessToken, refreshToken] = await Promise.all([
        tokenService.generateAccessToken(userId, sessionId),
        tokenService.generateRefreshToken(userId, sessionId),
      ]);

      const session = Session.create({
        id: sessionId,
        userId,
        accessToken,
        refreshToken,
      });
      await sessionRepository.create(session);

      // Act
      await auth.revokeAccessFromUser(userId);

      // Assert
      const deletedSession = await sessionRepository.findByRefreshToken(
        refreshToken,
      );
      expect(deletedSession).toBeUndefined();
    });
  });
});
