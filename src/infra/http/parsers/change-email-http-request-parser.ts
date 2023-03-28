import { ChangeEmailRequest } from '@/application/use-cases/change-email';
import { HttpRequest } from '@/presentation/ports/http-request';
import { z } from 'zod';
import { authorizationSchema } from './schemas/authorization-schema';
import { ZodHttpRequestParser } from './zod-http-request-parser';

export class ChangeEmailHttpRequestParser extends ZodHttpRequestParser<ChangeEmailRequest> {
  // eslint-disable-next-line class-methods-use-this
  protected parseRequest(request: HttpRequest): ChangeEmailRequest {
    const headersSchema = z.object({
      authorization: authorizationSchema,
    });

    const bodySchema = z.object({
      email: z.string(),
    });

    const parsedHeadersSchema = headersSchema.parse(request.headers);
    const parsedBodySchema = bodySchema.parse(request.body);

    return {
      accessToken: parsedHeadersSchema.authorization,
      email: parsedBodySchema.email,
    };
  }
}
