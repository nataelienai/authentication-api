import { InvalidPasswordError } from './errors/invalid-password-error';
import { Password } from './password';

describe('Password', () => {
  describe('create', () => {
    test('When password is empty, should return an error', () => {
      // Arrange
      const password = '';

      // Act
      const errorOrPassword = Password.create(password);

      // Assert
      expect(errorOrPassword.isLeft()).toBe(true);
      expect(errorOrPassword.value).toBeInstanceOf(InvalidPasswordError);
    });

    test('When password is blank, should return an error', () => {
      // Arrange
      const password = '          ';

      // Act
      const errorOrPassword = Password.create(password);

      // Assert
      expect(errorOrPassword.isLeft()).toBe(true);
      expect(errorOrPassword.value).toBeInstanceOf(InvalidPasswordError);
    });

    test('When password has less than 8 characters (min length), should return an error', () => {
      // Arrange
      const password = 'almost';

      // Act
      const errorOrPassword = Password.create(password);

      // Assert
      expect(errorOrPassword.isLeft()).toBe(true);
      expect(errorOrPassword.value).toBeInstanceOf(InvalidPasswordError);
    });

    test('When password has invalid characters, should return an error', () => {
      // Arrange
      const password = 'invalidºª§password¹²³£¢¬';

      // Act
      const errorOrPassword = Password.create(password);

      // Assert
      expect(errorOrPassword.isLeft()).toBe(true);
      expect(errorOrPassword.value).toBeInstanceOf(InvalidPasswordError);
    });

    test('When password has all valid characters, should return the created password', () => {
      // Arrange
      const password = 'valid123password!"#$%&\'()*+,./:;<=>?@[\\]^`{|}~-';

      // Act
      const errorOrPassword = Password.create(password);

      // Assert
      expect(errorOrPassword.isRight()).toBe(true);
      expect(errorOrPassword.value).toBeInstanceOf(Password);

      const createdPassword = errorOrPassword.value as Password;
      expect(createdPassword.value).toBe(password);
    });
  });
});
