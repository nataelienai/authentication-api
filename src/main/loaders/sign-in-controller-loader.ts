import { SignIn } from '@/application/use-cases/sign-in';
import { SignInHttpRequestParser } from '@/infra/http/parsers/sign-in-http-request-parser';
import { SignInController } from '@/presentation/controllers/sign-in-controller';
import { getSessionRepository } from '../singletons/session-repository';
import { getUserRepository } from '../singletons/user-repository';
import { getPasswordHasher } from '../singletons/password-hasher';
import { getTokenService } from '../singletons/token-service';

export async function getSignInController() {
  const [userRepository, sessionRepository] = await Promise.all([
    getUserRepository(),
    getSessionRepository(),
  ]);

  const signIn = new SignIn(
    getPasswordHasher(),
    userRepository,
    getTokenService(),
    sessionRepository,
  );

  const signInHttpRequestParser = new SignInHttpRequestParser();

  return new SignInController(signIn, signInHttpRequestParser);
}
