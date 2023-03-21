import { SignUp } from '@/application/use-cases/sign-up';
import { SignUpHttpRequestParser } from '@/infra/http/parsers/sign-up-http-request-parser';
import { SignUpController } from '@/presentation/controllers/sign-up-controller';
import { getUserRepository } from './user-repository';
import { getPasswordHasher } from './password-hasher';
import { getAuth } from './auth';

export async function getSignUpController() {
  const [userRepository, auth] = await Promise.all([
    getUserRepository(),
    getAuth(),
  ]);

  const signUp = new SignUp(getPasswordHasher(), userRepository, auth);

  const signUpHttpRequestParser = new SignUpHttpRequestParser();

  return new SignUpController(signUp, signUpHttpRequestParser);
}
