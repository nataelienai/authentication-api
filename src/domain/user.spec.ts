import { Email } from './email';
import { InvalidTimestampsError } from './errors/invalid-timestamps-error';
import { HashedPassword } from './hashed-password';
import { User } from './user';

const VALID_EMAIL = 'email@example.com';

describe('User', () => {
  describe('create', () => {
    test('When creation date is provided and update date is not, should return an error', () => {
      // Arrange
      const user = {
        id: 'id123',
        email: Email.create(VALID_EMAIL).value as Email,
        hashedPassword: new HashedPassword('lskdjflk2jr03jr093j'),
        createdAt: new Date(),
      };

      // Act
      const errorOrUser = User.create(user);

      // Assert
      expect(errorOrUser.isLeft()).toBe(true);
      expect(errorOrUser.value).toBeInstanceOf(InvalidTimestampsError);
    });

    test('When update date is provided and creation date is not, should return an error', () => {
      // Arrange
      const user = {
        id: 'id123',
        email: Email.create(VALID_EMAIL).value as Email,
        hashedPassword: new HashedPassword('lskdjflk2jr03jr093j'),
        updatedAt: new Date(),
      };

      // Act
      const errorOrUser = User.create(user);

      // Assert
      expect(errorOrUser.isLeft()).toBe(true);
      expect(errorOrUser.value).toBeInstanceOf(InvalidTimestampsError);
    });

    test('When creation date is greater than update date, should return an error', () => {
      // Arrange
      const creationDate = new Date();
      const updateDate = new Date(creationDate.getTime() - 1);
      const user = {
        id: 'id123',
        email: Email.create(VALID_EMAIL).value as Email,
        hashedPassword: new HashedPassword('lskdjflk2jr03jr093j'),
        createdAt: creationDate,
        updatedAt: updateDate,
      };

      // Act
      const errorOrUser = User.create(user);

      // Assert
      expect(errorOrUser.isLeft()).toBe(true);
      expect(errorOrUser.value).toBeInstanceOf(InvalidTimestampsError);
    });

    test('When creation and update dates are not provided, should return the created user with new and same dates', () => {
      // Arrange
      const user = {
        id: 'id123',
        email: Email.create(VALID_EMAIL).value as Email,
        hashedPassword: new HashedPassword('lskdjflk2jr03jr093j'),
      };

      // Act
      const errorOrUser = User.create(user);

      // Assert
      expect(errorOrUser.isRight()).toBe(true);
      expect(errorOrUser.value).toBeInstanceOf(User);

      const createdUser = errorOrUser.value as User;
      expect(createdUser.createdAt).toEqual(createdUser.updatedAt);
    });

    test('When id is not provided, should return the created user with new id', () => {
      // Arrange
      const user = {
        email: Email.create(VALID_EMAIL).value as Email,
        hashedPassword: new HashedPassword('lskdjflk2jr03jr093j'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Act
      const errorOrUser = User.create(user);

      // Assert
      expect(errorOrUser.isRight()).toBe(true);
      expect(errorOrUser.value).toBeInstanceOf(User);

      const createdUser = errorOrUser.value as User;
      expect(createdUser.id.trim()).toBeTruthy();
    });

    test('When all properties are provided, should return the created user', () => {
      // Arrange
      const user = {
        id: 'id123',
        email: Email.create(VALID_EMAIL).value as Email,
        hashedPassword: new HashedPassword('lskdjflk2jr03jr093j'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Act
      const errorOrUser = User.create(user);

      // Assert
      expect(errorOrUser.isRight()).toBe(true);
      expect(errorOrUser.value).toBeInstanceOf(User);

      const createdUser = errorOrUser.value as User;
      expect(createdUser.id).toBe(user.id);
      expect(createdUser.email.value).toBe(user.email.value);
      expect(createdUser.hashedPassword.value).toBe(user.hashedPassword.value);
      expect(createdUser.createdAt).toBe(user.createdAt);
      expect(createdUser.updatedAt).toBe(user.updatedAt);
    });
  });

  describe('set email', () => {
    test('When given an email, should update the email and update date', () => {
      // Arrange
      const creationDate = new Date();
      const user = User.create({
        id: 'id123',
        email: Email.create(VALID_EMAIL).value as Email,
        hashedPassword: new HashedPassword('lskdjflk2jr03jr093j'),
        createdAt: creationDate,
        updatedAt: creationDate,
      }).value as User;
      const newEmail = Email.create('new.email@example.com').value as Email;

      // Act
      user.email = newEmail;

      // Assert
      expect(user.email.value).toBe(newEmail.value);
      expect(user.updatedAt).not.toBe(creationDate);
    });
  });

  describe('set hashed password', () => {
    test('When given a hashed password, should update the hashed password and update date', () => {
      // Arrange
      const creationDate = new Date();
      const user = User.create({
        id: 'id123',
        email: Email.create(VALID_EMAIL).value as Email,
        hashedPassword: new HashedPassword('lskdjflk2jr03jr093j'),
        createdAt: creationDate,
        updatedAt: creationDate,
      }).value as User;
      const newHashedPassword = new HashedPassword(
        'l331412dsadasd333jr3e32dasd',
      );

      // Act
      user.hashedPassword = newHashedPassword;

      // Assert
      expect(user.hashedPassword.value).toBe(newHashedPassword.value);
      expect(user.updatedAt).not.toBe(creationDate);
    });
  });
});
