import { HashedPassword } from './hashed-password';

describe('Hashed Password', () => {
  describe('constructor', () => {
    test('When given any string, should save it raw', () => {
      // Arrange
      const hashedPassword = 'abcdef123456';

      // Act
      const createdHashedPassword = new HashedPassword(hashedPassword);

      // Assert
      expect(createdHashedPassword.value).toBe(hashedPassword);
    });
  });
});
