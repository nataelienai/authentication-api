import { Session } from '@/domain/session';
import { Either, left, right } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { Auth } from './auth';

export type RefreshAccessTokenRequest = {
  refreshToken: string;
};

export type RefreshAccessTokenResponse = {
  session: Session;
};

export class RefreshAccessToken {
  constructor(private readonly auth: Auth) {}

  async execute(
    request: RefreshAccessTokenRequest,
  ): Promise<Either<InvalidTokenError, RefreshAccessTokenResponse>> {
    const errorOrSession = await this.auth.refreshAccessToken(
      request.refreshToken,
    );

    if (errorOrSession.isLeft()) {
      return left(errorOrSession.value);
    }

    const session = errorOrSession.value;
    return right({ session });
  }
}
