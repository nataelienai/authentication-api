import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  ChangePassword,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '@/application/use-cases/change-password';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import { HttpServer } from '../ports/http-server';
import { badRequest, notFound, ok } from '../utils/http-responses';
import { Controller } from './controller';

export class ChangePasswordController extends Controller<
  ChangePasswordRequest,
  ChangePasswordResponse
> {
  private readonly httpRoute: HttpRoute = {
    method: 'patch',
    path: '/user/password',
  };

  constructor(
    private readonly changePassword: ChangePassword,
    httpRequestParser: HttpRequestParser<ChangePasswordRequest>,
    httpServer: HttpServer,
  ) {
    super(httpRequestParser);
    httpServer.on('patch', '/user/password', this);
  }

  get route() {
    return this.httpRoute;
  }

  protected async execute(
    changePasswordRequest: ChangePasswordRequest,
  ): Promise<HttpResponse<Error | ChangePasswordResponse>> {
    const errorOrChangePasswordResponse = await this.changePassword.execute(
      changePasswordRequest,
    );

    if (errorOrChangePasswordResponse.isLeft()) {
      const error = errorOrChangePasswordResponse.value;

      if (error instanceof UserNotFoundError) {
        return notFound(error);
      }

      return badRequest(error);
    }

    const changePasswordResponse = errorOrChangePasswordResponse.value;
    return ok(changePasswordResponse);
  }
}
