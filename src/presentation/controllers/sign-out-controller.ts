import { SignOut, SignOutRequest } from '@/application/use-cases/sign-out';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { HttpServer } from '../ports/http-server';
import { badRequest, noContent } from '../utils/http-responses';
import { Controller } from './controller';

export class SignOutController extends Controller<SignOutRequest, void> {
  constructor(
    private readonly signOut: SignOut,
    httpRequestValidator: HttpRequestValidator<SignOutRequest>,
    httpServer: HttpServer,
  ) {
    super(httpRequestValidator);
    httpServer.on('post', '/sign-out', this);
  }

  protected async execute(
    signOutRequest: SignOutRequest,
  ): Promise<HttpResponse<Error | void>> {
    const errorOrVoid = await this.signOut.execute(signOutRequest);

    if (errorOrVoid.isLeft()) {
      const error = errorOrVoid.value;
      return badRequest(error);
    }

    return noContent(undefined);
  }
}
