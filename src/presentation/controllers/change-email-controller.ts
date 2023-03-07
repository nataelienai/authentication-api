import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  ChangeEmail,
  ChangeEmailRequest,
  ChangeEmailResponse,
} from '@/application/use-cases/change-email';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { Controller } from './controller';

export class ChangeEmailController extends Controller<
  ChangeEmailRequest,
  ChangeEmailResponse
> {
  constructor(
    private readonly changeEmail: ChangeEmail,
    httpRequestValidator: HttpRequestValidator<ChangeEmailRequest>,
  ) {
    super(httpRequestValidator);
  }

  protected async execute(
    changeEmailRequest: ChangeEmailRequest,
  ): Promise<HttpResponse<Error | ChangeEmailResponse>> {
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
