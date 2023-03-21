import { RefreshAccessToken } from '@/application/use-cases/refresh-access-token';
import { RefreshAccessTokenHttpRequestParser } from '@/infra/http/parsers/refresh-access-token-http-request-parser';
import { RefreshAccessTokenController } from '@/presentation/controllers/refresh-access-token-controller';
import { getAuth } from './auth';

export async function getRefreshAccessTokenController() {
  const refreshAccessToken = new RefreshAccessToken(await getAuth());

  const refreshAccessTokenHttpRequestParser =
    new RefreshAccessTokenHttpRequestParser();

  return new RefreshAccessTokenController(
    refreshAccessToken,
    refreshAccessTokenHttpRequestParser,
  );
}
