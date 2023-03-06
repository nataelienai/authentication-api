import { SignOut, SignOutRequest } from '@/application/use-cases/sign-out';
import { HttpRequest } from '../ports/http-request';
import { HttpRequestValidator } from '../ports/http-request-validator';

type HttpResponse = {
  statusCode: number;
  body?: Error;
};

export class SignOutController {
  constructor(
    private readonly signOut: SignOut,
    private readonly httpRequestValidator: HttpRequestValidator<SignOutRequest>,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const errorOrSignOutRequest = this.httpRequestValidator.validate(request);

    if (errorOrSignOutRequest.isLeft()) {
      const error = errorOrSignOutRequest.value;
      return { statusCode: 400, body: error };
    }

    const signOutRequest = errorOrSignOutRequest.value;
    const errorOrVoid = await this.signOut.execute(signOutRequest);

    if (errorOrVoid.isLeft()) {
      const error = errorOrVoid.value;
      return { statusCode: 400, body: error };
    }

    return { statusCode: 204 };
  }
}
