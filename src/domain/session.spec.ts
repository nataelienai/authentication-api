import { Session } from './session';

describe('Session', () => {
  describe('create', () => {
    test('When id is not provided, should return the created session with a new id', () => {
      // Arrange
      const session = {
        accessToken: 'abcdef123456',
        refreshToken: 'fedcba654321',
        userId: 'cbafed321456',
      };

      // Act
      const createdSession = Session.create(session);

      // Assert
      expect(createdSession.id).not.toHaveLength(0);
      expect(createdSession.accessToken).toBe(session.accessToken);
      expect(createdSession.refreshToken).toBe(session.refreshToken);
      expect(createdSession.userId).toBe(session.userId);
    });

    test('When all properties are provided, should return the created session', () => {
      // Arrange
      const session = {
        id: 'asdfghjklç1234509876',
        accessToken: 'abcdef123456',
        refreshToken: 'fedcba654321',
        userId: 'cbafed321456',
      };

      // Act
      const createdSession = Session.create(session);

      // Assert
      expect(createdSession.id).toBe(session.id);
      expect(createdSession.accessToken).toBe(session.accessToken);
      expect(createdSession.refreshToken).toBe(session.refreshToken);
      expect(createdSession.userId).toBe(session.userId);
    });
  });

  describe('set accessToken', () => {
    test('When given any string, should update the accessToken property', () => {
      // Arrange
      const createdSession = Session.create({
        id: 'asdfghjklç1234509876',
        accessToken: 'abcdef123456',
        refreshToken: 'fedcba654321',
        userId: 'cbafed321456',
      });
      const newAccessToken = '123456abcdef';

      // Act
      createdSession.accessToken = newAccessToken;

      // Assert
      expect(createdSession.accessToken).toBe(newAccessToken);
    });
  });

  describe('set refreshToken', () => {
    test('When given any string, should update the refreshToken property', () => {
      // Arrange
      const createdSession = Session.create({
        id: 'asdfghjklç123450987',
        accessToken: 'abcdef123456',
        refreshToken: 'fedcba654321',
        userId: 'cbafed321456',
      });
      const newRefreshToken = '654321fedcba';

      // Act
      createdSession.refreshToken = newRefreshToken;

      // Assert
      expect(createdSession.refreshToken).toBe(newRefreshToken);
    });
  });
});
