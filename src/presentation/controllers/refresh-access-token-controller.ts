import {
  RefreshAccessToken,
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse,
} from '@/application/use-cases/refresh-access-token';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpServer } from '../ports/http-server';
import { badRequest, ok } from '../utils/http-responses';
import { Controller } from './controller';

export class RefreshAccessTokenController extends Controller<
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse
> {
  constructor(
    private readonly refreshAccessToken: RefreshAccessToken,
    httpRequestParser: HttpRequestParser<RefreshAccessTokenRequest>,
    httpServer: HttpServer,
  ) {
    super(httpRequestParser);
    httpServer.on('post', '/token', this);
  }

  protected async execute(
    refreshAccessTokenRequest: RefreshAccessTokenRequest,
  ): Promise<HttpResponse<Error | RefreshAccessTokenResponse>> {
    const errorOrRefreshAccessTokenResponse =
      await this.refreshAccessToken.execute(refreshAccessTokenRequest);

    if (errorOrRefreshAccessTokenResponse.isLeft()) {
      const error = errorOrRefreshAccessTokenResponse.value;
      return badRequest(error);
    }

    const refreshAccessTokenResponse = errorOrRefreshAccessTokenResponse.value;
    return ok(refreshAccessTokenResponse);
  }
}
