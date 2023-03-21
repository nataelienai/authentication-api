import { Either } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { Auth } from './auth';

export type SignOutRequest = {
  accessToken: string;
};

export class SignOut {
  constructor(private readonly auth: Auth) {}

  async execute(
    request: SignOutRequest,
  ): Promise<Either<InvalidTokenError, void>> {
    return this.auth.revokeAccessToken(request.accessToken);
  }
}
