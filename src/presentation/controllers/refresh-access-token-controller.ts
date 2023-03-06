import {
  RefreshAccessToken,
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse,
} from '@/application/use-cases/refresh-access-token';
import { Either } from '@/shared/either';
import { InvalidHttpRequestError } from '../errors/invalid-http-request-error';

type HttpRequest = {
  body: unknown;
};

type HttpResponse = {
  statusCode: number;
  body: RefreshAccessTokenResponse | Error;
};

interface HttpRequestValidator {
  validate(
    request: HttpRequest,
  ): Either<InvalidHttpRequestError, RefreshAccessTokenRequest>;
}

export class RefreshAccessTokenController {
  constructor(
    private readonly refreshAccessToken: RefreshAccessToken,
    private readonly httpRequestValidator: HttpRequestValidator,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const errorOrRefreshAccessTokenRequest =
      this.httpRequestValidator.validate(request);

    if (errorOrRefreshAccessTokenRequest.isLeft()) {
      const error = errorOrRefreshAccessTokenRequest.value;
      return { statusCode: 400, body: error };
    }

    const refreshAccessTokenRequest = errorOrRefreshAccessTokenRequest.value;
    const errorOrRefreshAccessTokenResponse =
      await this.refreshAccessToken.execute(refreshAccessTokenRequest);

    if (errorOrRefreshAccessTokenResponse.isLeft()) {
      const error = errorOrRefreshAccessTokenResponse.value;
      return { statusCode: 400, body: error };
    }

    const refreshAccessTokenResponse = errorOrRefreshAccessTokenResponse.value;
    return { statusCode: 200, body: refreshAccessTokenResponse };
  }
}
