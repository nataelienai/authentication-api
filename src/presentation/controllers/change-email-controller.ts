import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  ChangeEmail,
  ChangeEmailRequest,
  ChangeEmailResponse,
} from '@/application/use-cases/change-email';
import { HttpRequest } from '../ports/http-request';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';

export class ChangeEmailController {
  constructor(
    private readonly changeEmail: ChangeEmail,
    private readonly httpRequestValidator: HttpRequestValidator<ChangeEmailRequest>,
  ) {}

  async handle(
    request: HttpRequest,
  ): Promise<HttpResponse<Error | ChangeEmailResponse>> {
    const errorOrChangeEmailRequest =
      this.httpRequestValidator.validate(request);

    if (errorOrChangeEmailRequest.isLeft()) {
      const error = errorOrChangeEmailRequest.value;
      return { statusCode: 400, body: error };
    }

    const changeEmailRequest = errorOrChangeEmailRequest.value;
    const errorOrChangeEmailResponse = await this.changeEmail.execute(
      changeEmailRequest,
    );

    if (errorOrChangeEmailResponse.isLeft()) {
      const error = errorOrChangeEmailResponse.value;

      if (error instanceof UserNotFoundError) {
        return { statusCode: 404, body: error };
      }

      return { statusCode: 400, body: error };
    }

    const changeEmailResponse = errorOrChangeEmailResponse.value;
    return { statusCode: 200, body: changeEmailResponse };
  }
}
