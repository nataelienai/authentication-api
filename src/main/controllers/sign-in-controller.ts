/* eslint-disable no-new */
import { SignIn } from '@/application/use-cases/sign-in';
import { SignInHttpRequestParser } from '@/infra/http/parsers/sign-in-http-request-parser';
import { SignInController } from '@/presentation/controllers/sign-in-controller';
import { getSessionRepository } from '../repositories/session-repository';
import { getUserRepository } from '../repositories/user-repository';
import { getHttpServer } from '../servers/http-server';
import { getPasswordHasher } from '../services/password-hasher';
import { getTokenService } from '../services/token-service';

export async function loadSignInController() {
  const signIn = new SignIn(
    getPasswordHasher(),
    getUserRepository(),
    getTokenService(),
    await getSessionRepository(),
  );

  const signInHttpRequestParser = new SignInHttpRequestParser();

  new SignInController(signIn, signInHttpRequestParser, getHttpServer());
}
