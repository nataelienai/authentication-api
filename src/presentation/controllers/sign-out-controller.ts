import { SignOut, SignOutRequest } from '@/application/use-cases/sign-out';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { Controller } from './controller';

export class SignOutController extends Controller<SignOutRequest, void> {
  constructor(
    private readonly signOut: SignOut,
    httpRequestValidator: HttpRequestValidator<SignOutRequest>,
  ) {
    super(httpRequestValidator);
  }

  async execute(
    signOutRequest: SignOutRequest,
  ): Promise<HttpResponse<Error | void>> {
    const errorOrVoid = await this.signOut.execute(signOutRequest);

    if (errorOrVoid.isLeft()) {
      const error = errorOrVoid.value;
      return { statusCode: 400, body: error };
    }

    return { statusCode: 204, body: undefined };
  }
}
