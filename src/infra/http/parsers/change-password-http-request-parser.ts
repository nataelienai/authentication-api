import { ChangePasswordRequest } from '@/application/use-cases/change-password';
import { HttpRequest } from '@/presentation/ports/http-request';
import { z } from 'zod';
import { ZodHttpRequestParser } from './zod-http-request-parser';

export class ChangePasswordHttpRequestParser extends ZodHttpRequestParser<ChangePasswordRequest> {
  // eslint-disable-next-line class-methods-use-this
  protected parseRequest(request: HttpRequest): ChangePasswordRequest {
    const schema = z.object({
      headers: z.object({
        authorization: z
          .string()
          .startsWith('Bearer ')
          .transform((token) => token.split('Bearer ')[1]),
      }),
      body: z.object({
        password: z.string(),
      }),
    });
    const parsedRequest = schema.parse(request);

    return {
      password: parsedRequest.body.password,
      accessToken: parsedRequest.headers.authorization,
    };
  }
}
