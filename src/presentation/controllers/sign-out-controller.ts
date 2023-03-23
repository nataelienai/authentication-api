import { SignOut, SignOutRequest } from '@/application/use-cases/sign-out';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import { badRequest, ErrorResponse, noContent } from '../utils/http-responses';
import { Controller } from './controller';

export class SignOutController extends Controller<SignOutRequest, void> {
  private readonly httpRoute: HttpRoute = {
    method: 'post',
    path: '/sign-out',
  };

  constructor(
    private readonly signOut: SignOut,
    httpRequestParser: HttpRequestParser<SignOutRequest>,
  ) {
    super(httpRequestParser);
  }

  get route() {
    return this.httpRoute;
  }

  protected async execute(
    signOutRequest: SignOutRequest,
  ): Promise<HttpResponse<ErrorResponse | void>> {
    const errorOrVoid = await this.signOut.execute(signOutRequest);

    if (errorOrVoid.isLeft()) {
      const error = errorOrVoid.value;
      return badRequest({ message: error.message });
    }

    return noContent();
  }
}
