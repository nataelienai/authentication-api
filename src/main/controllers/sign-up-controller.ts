/* eslint-disable no-new */
import { SignUp } from '@/application/use-cases/sign-up';
import { SignUpHttpRequestParser } from '@/infra/http/parsers/sign-up-http-request-parser';
import { SignUpController } from '@/presentation/controllers/sign-up-controller';
import { getSessionRepository } from '../repositories/session-repository';
import { getUserRepository } from '../repositories/user-repository';
import { getHttpServer } from '../servers/http-server';
import { getPasswordHasher } from '../services/password-hasher';
import { getTokenService } from '../services/token-service';

export async function loadSignUpController() {
  const signUp = new SignUp(
    getPasswordHasher(),
    getUserRepository(),
    getTokenService(),
    await getSessionRepository(),
  );

  const signUpHttpRequestParser = new SignUpHttpRequestParser();

  new SignUpController(signUp, signUpHttpRequestParser, getHttpServer());
}
