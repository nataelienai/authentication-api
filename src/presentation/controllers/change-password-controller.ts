import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  ChangePassword,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '@/application/use-cases/change-password';
import { HttpRequest } from '../ports/http-request';
import { HttpRequestValidator } from '../ports/http-request-validator';

type HttpResponse = {
  statusCode: number;
  body: ChangePasswordResponse | Error;
};

export class ChangePasswordController {
  constructor(
    private readonly changePassword: ChangePassword,
    private readonly httpRequestValidator: HttpRequestValidator<ChangePasswordRequest>,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const errorOrChangePasswordRequest =
      this.httpRequestValidator.validate(request);

    if (errorOrChangePasswordRequest.isLeft()) {
      const error = errorOrChangePasswordRequest.value;
      return { statusCode: 400, body: error };
    }

    const changePasswordRequest = errorOrChangePasswordRequest.value;
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
