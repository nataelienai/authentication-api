import { SignIn } from '@/application/use-cases/sign-in';
import { SignInHttpRequestParser } from '@/infra/http/parsers/sign-in-http-request-parser';
import { SignInController } from '@/presentation/controllers/sign-in-controller';
import { getUserRepository } from './user-repository';
import { getPasswordHasher } from './password-hasher';
import { getAuth } from './auth';

export async function getSignInController() {
  const [userRepository, auth] = await Promise.all([
    getUserRepository(),
    getAuth(),
  ]);

  const signIn = new SignIn(getPasswordHasher(), userRepository, auth);

  const signInHttpRequestParser = new SignInHttpRequestParser();

  return new SignInController(signIn, signInHttpRequestParser);
}
