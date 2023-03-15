import { RefreshAccessTokenRequest } from '@/application/use-cases/refresh-access-token';
import { HttpRequest } from '@/presentation/ports/http-request';
import { z } from 'zod';
import { ZodHttpRequestParser } from './zod-http-request-parser';

export class RefreshAccessTokenHttpRequestParser extends ZodHttpRequestParser<RefreshAccessTokenRequest> {
  // eslint-disable-next-line class-methods-use-this
  protected parseRequest(request: HttpRequest): RefreshAccessTokenRequest {
    const schema = z.object({
      refreshToken: z
        .string()
        .startsWith('Bearer ')
        .transform((token) => token.split('Bearer ')[1]),
    });

    return schema.parse(request.headers);
  }
}
