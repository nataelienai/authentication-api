import { SignOut } from '@/application/use-cases/sign-out';
import { SignOutHttpRequestParser } from '@/infra/http/parsers/sign-out-http-request-parser';
import { SignOutController } from '@/presentation/controllers/sign-out-controller';
import { getAuth } from './auth';

export async function getSignOutController() {
  const signOut = new SignOut(await getAuth());

  const signOutHttpRequestParser = new SignOutHttpRequestParser();

  return new SignOutController(signOut, signOutHttpRequestParser);
}
