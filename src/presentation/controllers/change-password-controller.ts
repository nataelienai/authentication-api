import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  ChangePassword,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '@/application/use-cases/change-password';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { HttpServer } from '../ports/http-server';
import { badRequest, notFound, ok } from '../utils/http-responses';
import { Controller } from './controller';

export class ChangePasswordController extends Controller<
  ChangePasswordRequest,
  ChangePasswordResponse
> {
  constructor(
    private readonly changePassword: ChangePassword,
    httpRequestValidator: HttpRequestValidator<ChangePasswordRequest>,
    httpServer: HttpServer,
  ) {
    super(httpRequestValidator);
    httpServer.on('patch', '/user/password', this);
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
