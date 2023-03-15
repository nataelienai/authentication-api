import { GetUserRequest } from '@/application/use-cases/get-user';
import { HttpRequest } from '@/presentation/ports/http-request';
import { z } from 'zod';
import { ZodHttpRequestParser } from './zod-http-request-parser';

export class GetUserHttpRequestParser extends ZodHttpRequestParser<GetUserRequest> {
  // eslint-disable-next-line class-methods-use-this
  protected parseRequest(request: HttpRequest): GetUserRequest {
    const schema = z.object({
      accessToken: z
        .string()
        .startsWith('Bearer ')
        .transform((token) => token.split('Bearer ')[1]),
    });

    return schema.parse(request.headers);
  }
}
