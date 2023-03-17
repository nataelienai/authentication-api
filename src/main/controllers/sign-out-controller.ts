/* eslint-disable no-new */
import { SignOut } from '@/application/use-cases/sign-out';
import { SignOutHttpRequestParser } from '@/infra/http/parsers/sign-out-http-request-parser';
import { SignOutController } from '@/presentation/controllers/sign-out-controller';
import { getSessionRepository } from '../repositories/session-repository';
import { getHttpServer } from '../servers/http-server';
import { getTokenService } from '../services/token-service';

export async function loadSignOutController() {
  const signOut = new SignOut(getTokenService(), await getSessionRepository());

  const signOutHttpRequestParser = new SignOutHttpRequestParser();

  new SignOutController(signOut, signOutHttpRequestParser, getHttpServer());
}
