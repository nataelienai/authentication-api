import { ChangeEmailRequest } from '@/application/use-cases/change-email';
import { HttpRequest } from '@/presentation/ports/http-request';
import { z } from 'zod';
import { ZodHttpRequestParser } from './zod-http-request-parser';

export class ChangeEmailHttpRequestParser extends ZodHttpRequestParser<ChangeEmailRequest> {
  // eslint-disable-next-line class-methods-use-this
  protected parseRequest(request: HttpRequest): ChangeEmailRequest {
    const schema = z.object({
      headers: z.object({
        accessToken: z
          .string()
          .startsWith('Bearer ')
          .transform((token) => token.split('Bearer ')[1]),
      }),
      body: z.object({
        email: z.string(),
      }),
    });
    const parsedRequest = schema.parse(request);

    return {
      email: parsedRequest.body.email,
      accessToken: parsedRequest.headers.accessToken,
    };
  }
}
