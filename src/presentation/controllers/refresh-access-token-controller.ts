import {
  RefreshAccessToken,
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse,
} from '@/application/use-cases/refresh-access-token';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { Controller } from './controller';

export class RefreshAccessTokenController extends Controller<
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse
> {
  constructor(
    private readonly refreshAccessToken: RefreshAccessToken,
    httpRequestValidator: HttpRequestValidator<RefreshAccessTokenRequest>,
  ) {
    super(httpRequestValidator);
  }

  protected async execute(
    refreshAccessTokenRequest: RefreshAccessTokenRequest,
  ): Promise<HttpResponse<Error | RefreshAccessTokenResponse>> {
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
