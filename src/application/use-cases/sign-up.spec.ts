import { FakePasswordHasher } from '@test/doubles/fake-password-hasher';
import { FakeTokenService } from '@test/doubles/fake-token-service';
import { InMemoryUserRepository } from '@test/doubles/in-memory-user-repository';
import { InMemorySessionRepository } from '@test/doubles/in-memory-session-repository';
import { InvalidEmailError } from '@/domain/errors/invalid-email-error';
import { InvalidPasswordError } from '@/domain/errors/invalid-password-error';
import { User } from '@/domain/user';
import { Email } from '@/domain/email';
import { Password } from '@/domain/password';
import { PasswordHasher } from '../ports/password-hasher';
import { SessionRepository } from '../ports/session-repository';
import { TokenService } from '../ports/token-service';
import { UserRepository } from '../ports/user-repository';
import { Auth } from './auth';
import { SignUp } from './sign-up';
import { EmailAlreadyExistsError } from '../errors/email-already-exists-error';

const VALID_EMAIL = 'valid@email.com';

describe('Sign Up', () => {
  let passwordHasher: PasswordHasher;
  let userRepository: UserRepository;
  let tokenService: TokenService;
  let sessionRepository: SessionRepository;
  let auth: Auth;
  let signUp: SignUp;

  beforeEach(() => {
    passwordHasher = new FakePasswordHasher();
    userRepository = new InMemoryUserRepository();
    tokenService = new FakeTokenService();
    sessionRepository = new InMemorySessionRepository();
    auth = new Auth(tokenService, sessionRepository);
    signUp = new SignUp(passwordHasher, userRepository, auth);
  });

  test('When email is invalid, return an error', async () => {
    // Arrange
    // Act
    const errorOrResponse = await signUp.execute({
      email: 'invalid_email',
      password: 'strong_password',
    });

    // Assert
    expect(errorOrResponse.isLeft()).toBe(true);
    expect(errorOrResponse.value).toBeInstanceOf(InvalidEmailError);
  });

  test('When password is invalid, return an error', async () => {
    // Arrange
    // Act
    const errorOrResponse = await signUp.execute({
      email: VALID_EMAIL,
      password: 'weak',
    });

    // Assert
    expect(errorOrResponse.isLeft()).toBe(true);
    expect(errorOrResponse.value).toBeInstanceOf(InvalidPasswordError);
  });

  test('When email already exists, return an error', async () => {
    // Arrange
    const user = User.create({
      email: Email.create(VALID_EMAIL).value as Email,
      hashedPassword: await passwordHasher.hash(
        Password.create('password123').value as Password,
      ),
    }).value as User;
    await userRepository.create(user);

    // Act
    const errorOrResponse = await signUp.execute({
      email: user.email.value,
      password: 'strong_password',
    });

    // Assert
    expect(errorOrResponse.isLeft()).toBe(true);
    expect(errorOrResponse.value).toBeInstanceOf(EmailAlreadyExistsError);
  });

  test('When email and password are valid, return response with user and session', async () => {
    // Arrange
    const email = VALID_EMAIL;
    const password = 'strong_password';

    // Act
    const errorOrResponse = await signUp.execute({ email, password });

    // Assert
    expect(errorOrResponse.isRight()).toBe(true);
    expect(errorOrResponse.value).toHaveProperty('user.email.value', email);
    expect(errorOrResponse.value).toHaveProperty('session');
  });
});
