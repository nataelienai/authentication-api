import {
  RefreshAccessToken,
  RefreshAccessTokenRequest,
} from '@/application/use-cases/refresh-access-token';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import { ErrorResponse, ok, unauthorized } from '../utils/http-responses';
import { Controller } from './controller';
import { SessionDto, SessionMapper } from './mappers/session-mapper';

type RefreshAccessTokenControllerResponse = {
  session: SessionDto;
};

export class RefreshAccessTokenController extends Controller<
  RefreshAccessTokenRequest,
  RefreshAccessTokenControllerResponse
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
  ): Promise<
    HttpResponse<ErrorResponse | RefreshAccessTokenControllerResponse>
  > {
    const errorOrRefreshAccessTokenResponse =
      await this.refreshAccessToken.execute(refreshAccessTokenRequest);

    if (errorOrRefreshAccessTokenResponse.isLeft()) {
      const error = errorOrRefreshAccessTokenResponse.value;
      return unauthorized({ message: error.message });
    }

    const refreshAccessTokenResponse = errorOrRefreshAccessTokenResponse.value;
    const session = SessionMapper.mapToDto(refreshAccessTokenResponse.session);

    return ok({ session });
  }
}
