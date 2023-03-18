/* eslint-disable no-new */
import { SignUp } from '@/application/use-cases/sign-up';
import { SignUpHttpRequestParser } from '@/infra/http/parsers/sign-up-http-request-parser';
import { SignUpController } from '@/presentation/controllers/sign-up-controller';
import { getSessionRepository } from '../singletons/session-repository';
import { getUserRepository } from '../singletons/user-repository';
import { getHttpServer } from '../singletons/http-server';
import { getPasswordHasher } from '../singletons/password-hasher';
import { getTokenService } from '../singletons/token-service';

export async function loadSignUpController() {
  const [userRepository, sessionRepository] = await Promise.all([
    getUserRepository(),
    getSessionRepository(),
  ]);

  const signUp = new SignUp(
    getPasswordHasher(),
    userRepository,
    getTokenService(),
    sessionRepository,
  );

  const signUpHttpRequestParser = new SignUpHttpRequestParser();

  const httpServer = getHttpServer();
  const controller = new SignUpController(
    signUp,
    signUpHttpRequestParser,
    httpServer,
  );

  httpServer.register(controller);
}
