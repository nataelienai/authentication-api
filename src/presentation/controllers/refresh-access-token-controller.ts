import {
  RefreshAccessToken,
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse,
} from '@/application/use-cases/refresh-access-token';
import { HttpRequest } from '../ports/http-request';
import { HttpRequestValidator } from '../ports/http-request-validator';

type HttpResponse = {
  statusCode: number;
  body: RefreshAccessTokenResponse | Error;
};

export class RefreshAccessTokenController {
  constructor(
    private readonly refreshAccessToken: RefreshAccessToken,
    private readonly httpRequestValidator: HttpRequestValidator<RefreshAccessTokenRequest>,
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
