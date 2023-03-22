import {
  RefreshAccessToken,
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse,
} from '@/application/use-cases/refresh-access-token';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import { badRequest, ErrorResponse, ok } from '../utils/http-responses';
import { Controller } from './controller';

export class RefreshAccessTokenController extends Controller<
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse
> {
  private readonly httpRoute: HttpRoute = {
    method: 'post',
    path: '/token',
  };

  constructor(
    private readonly refreshAccessToken: RefreshAccessToken,
    httpRequestParser: HttpRequestParser<RefreshAccessTokenRequest>,
  ) {
    super(httpRequestParser);
  }

  get route() {
    return this.httpRoute;
  }

  protected async execute(
    refreshAccessTokenRequest: RefreshAccessTokenRequest,
  ): Promise<HttpResponse<ErrorResponse | RefreshAccessTokenResponse>> {
    const errorOrRefreshAccessTokenResponse =
      await this.refreshAccessToken.execute(refreshAccessTokenRequest);

    if (errorOrRefreshAccessTokenResponse.isLeft()) {
      const error = errorOrRefreshAccessTokenResponse.value;
      return badRequest({ message: error.message });
    }

    const refreshAccessTokenResponse = errorOrRefreshAccessTokenResponse.value;
    return ok(refreshAccessTokenResponse);
  }
}
