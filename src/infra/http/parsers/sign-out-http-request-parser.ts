import { SignOutRequest } from '@/application/use-cases/sign-out';
import { HttpRequest } from '@/presentation/ports/http-request';
import { z } from 'zod';
import { ZodHttpRequestParser } from './zod-http-request-parser';

export class SignOutHttpRequestParser extends ZodHttpRequestParser<SignOutRequest> {
  // eslint-disable-next-line class-methods-use-this
  protected parseRequest(request: HttpRequest): SignOutRequest {
    const schema = z.object({
      authorization: z
        .string()
        .startsWith('Bearer ')
        .transform((token) => token.split('Bearer ')[1]),
    });
    const parsedSchema = schema.parse(request.headers);

    return { accessToken: parsedSchema.authorization };
  }
}
