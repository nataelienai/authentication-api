import { Email } from './email';
import { InvalidEmailError } from './errors/invalid-email-error';

describe('Email', () => {
  describe('create', () => {
    test('When email is empty, should return an error', () => {
      // Arrange
      const email = '';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email is blank, should return an error', () => {
      // Arrange
      const email = '   ';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has only a "@", should return an error', () => {
      // Arrange
      const email = '@';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has no "@", should return an error', () => {
      // Arrange
      const email = 'email.example.com';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has multiple "@", should return an error', () => {
      // Arrange
      const email = 'email@not.here@example.com';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has empty local-part, should return an error', () => {
      // Arrange
      const email = '@example.com';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has empty domain, should return an error', () => {
      // Arrange
      const email = 'email@';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has local-part starting with ".", should return an error', () => {
      // Arrange
      const email = '.email@example.com';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has local-part ending with ".", should return an error', () => {
      // Arrange
      const email = 'email.@example.com';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has domain starting with ".", should return an error', () => {
      // Arrange
      const email = 'email@.example.com';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has domain ending with ".", should return an error', () => {
      // Arrange
      const email = 'email@example.com.';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has domain starting with "-", should return an error', () => {
      // Arrange
      const email = 'email@-example.com';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has domain ending with "-", should return an error', () => {
      // Arrange
      const email = 'email@example.com-';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has local-part containing "..", should return an error', () => {
      // Arrange
      const email = 'an..email@example.com';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has domain containing "..", should return an error', () => {
      // Arrange
      const email = 'email@example..com';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email is longer than 254 characters (max length), should return an error', () => {
      // Arrange
      const atomLength = 62;
      const atom = 'a'.repeat(atomLength);
      const email = `${atom}@${atom}.${atom}.${atom}.com`;

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has local-part longer than 64 characters (max length), should return an error', () => {
      // Arrange
      const localPartMaxLength = 64;
      const localPart = 'a'.repeat(localPartMaxLength + 1);
      const email = `${localPart}@example.com`;

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has domain label longer than 63 characters (max length), should return an error', () => {
      // Arrange
      const domainLabelMaxLength = 63;
      const domainLabel = 'a'.repeat(domainLabelMaxLength + 1);
      const email = `email@${domainLabel}.com`;

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has local-part containing invalid characters, should return an error', () => {
      // Arrange
      const email =
        'local-part.with.invalid"(,:;<>@[\\])"characters@example.com';

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email has domain containing invalid characters, should return an error', () => {
      // Arrange
      const email = "email@invalid{!#$%&'*+/=?^`{|}~-}domain.com";

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isLeft()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(InvalidEmailError);
    });

    test('When email is 254 characters long (max length), should return the created email', () => {
      // Arrange
      const atomLength = 62;
      const atom = 'a'.repeat(atomLength);
      const email = `${atom}@${atom}.${atom}.${atom}.co`;

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isRight()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(Email);

      const createdEmail = errorOrEmail.value as Email;
      expect(createdEmail.value).toBe(email);
    });

    test('When email has local-part with 64 characters (max length), should return the created email', () => {
      // Arrange
      const localPartMaxLength = 64;
      const localPart = 'a'.repeat(localPartMaxLength);
      const email = `${localPart}@example.com`;

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isRight()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(Email);

      const createdEmail = errorOrEmail.value as Email;
      expect(createdEmail.value).toBe(email);
    });

    test('When email has domain label with 63 characters (max length), should return the created email', () => {
      // Arrange
      const domainLabelMaxLength = 63;
      const domainLabel = 'a'.repeat(domainLabelMaxLength);
      const email = `email@${domainLabel}.com`;

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isRight()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(Email);

      const createdEmail = errorOrEmail.value as Email;
      expect(createdEmail.value).toBe(email);
    });

    test('When email has all valid characters, should return the created email', () => {
      // Arrange
      const email =
        "local-part.with.v4lid{!#$%&'*+/=?^`|~-}characters@domain-with-v4lid.characters.com";

      // Act
      const errorOrEmail = Email.create(email);

      // Assert
      expect(errorOrEmail.isRight()).toBe(true);
      expect(errorOrEmail.value).toBeInstanceOf(Email);

      const createdEmail = errorOrEmail.value as Email;
      expect(createdEmail.value).toBe(email);
    });
  });
});
