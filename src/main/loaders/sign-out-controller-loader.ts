import { SignOut } from '@/application/use-cases/sign-out';
import { SignOutHttpRequestParser } from '@/infra/http/parsers/sign-out-http-request-parser';
import { SignOutController } from '@/presentation/controllers/sign-out-controller';
import { getSessionRepository } from '../singletons/session-repository';
import { getTokenService } from '../singletons/token-service';

export async function getSignOutController() {
  const signOut = new SignOut(getTokenService(), await getSessionRepository());

  const signOutHttpRequestParser = new SignOutHttpRequestParser();

  return new SignOutController(signOut, signOutHttpRequestParser);
}
