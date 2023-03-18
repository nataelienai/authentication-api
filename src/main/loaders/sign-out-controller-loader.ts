/* eslint-disable no-new */
import { SignOut } from '@/application/use-cases/sign-out';
import { SignOutHttpRequestParser } from '@/infra/http/parsers/sign-out-http-request-parser';
import { SignOutController } from '@/presentation/controllers/sign-out-controller';
import { getSessionRepository } from '../singletons/session-repository';
import { getHttpServer } from '../singletons/http-server';
import { getTokenService } from '../singletons/token-service';

export async function loadSignOutController() {
  const signOut = new SignOut(getTokenService(), await getSessionRepository());

  const signOutHttpRequestParser = new SignOutHttpRequestParser();

  const httpServer = getHttpServer();
  const controller = new SignOutController(signOut, signOutHttpRequestParser);

  httpServer.register(controller);
}
