import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  ChangePassword,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '@/application/use-cases/change-password';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { Controller } from './controller';

export class ChangePasswordController extends Controller<
  ChangePasswordRequest,
  ChangePasswordResponse
> {
  constructor(
    private readonly changePassword: ChangePassword,
    httpRequestValidator: HttpRequestValidator<ChangePasswordRequest>,
  ) {
    super(httpRequestValidator);
  }

  async execute(
    changePasswordRequest: ChangePasswordRequest,
  ): Promise<HttpResponse<Error | ChangePasswordResponse>> {
    const errorOrChangePasswordResponse = await this.changePassword.execute(
      changePasswordRequest,
    );

    if (errorOrChangePasswordResponse.isLeft()) {
      const error = errorOrChangePasswordResponse.value;

      if (error instanceof UserNotFoundError) {
        return { statusCode: 404, body: error };
      }

      return { statusCode: 400, body: error };
    }

    const changePasswordResponse = errorOrChangePasswordResponse.value;
    return { statusCode: 200, body: changePasswordResponse };
  }
}
