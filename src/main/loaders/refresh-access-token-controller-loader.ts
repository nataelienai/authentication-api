/* eslint-disable no-new */
import { RefreshAccessToken } from '@/application/use-cases/refresh-access-token';
import { RefreshAccessTokenHttpRequestParser } from '@/infra/http/parsers/refresh-access-token-http-request-parser';
import { RefreshAccessTokenController } from '@/presentation/controllers/refresh-access-token-controller';
import { getSessionRepository } from '../singletons/session-repository';
import { getHttpServer } from '../singletons/http-server';
import { getTokenService } from '../singletons/token-service';

export async function loadRefreshAccessTokenController() {
  const refreshAccessToken = new RefreshAccessToken(
    await getSessionRepository(),
    getTokenService(),
  );

  const refreshAccessTokenHttpRequestParser =
    new RefreshAccessTokenHttpRequestParser();

  new RefreshAccessTokenController(
    refreshAccessToken,
    refreshAccessTokenHttpRequestParser,
    getHttpServer(),
  );
}
