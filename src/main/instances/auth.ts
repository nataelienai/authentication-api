import { Auth } from '@/application/use-cases/auth';
import { getSessionRepository } from './session-repository';
import { getTokenService } from './token-service';

let auth: Auth;

export async function getAuth() {
  if (!auth) {
    auth = new Auth(getTokenService(), await getSessionRepository());
  }
  return auth;
}
