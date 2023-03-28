import { ChangePasswordRequest } from '@/application/use-cases/change-password';
import { HttpRequest } from '@/presentation/ports/http-request';
import { z } from 'zod';
import { authorizationSchema } from './schemas/authorization-schema';
import { ZodHttpRequestParser } from './zod-http-request-parser';

export class ChangePasswordHttpRequestParser extends ZodHttpRequestParser<ChangePasswordRequest> {
  // eslint-disable-next-line class-methods-use-this
  protected parseRequest(request: HttpRequest): ChangePasswordRequest {
    const headersSchema = z.object({
      authorization: authorizationSchema,
    });

    const bodySchema = z.object({
      password: z.string(),
    });

    const parsedHeadersSchema = headersSchema.parse(request.headers);
    const parsedBodySchema = bodySchema.parse(request.body);

    return {
      accessToken: parsedHeadersSchema.authorization,
      password: parsedBodySchema.password,
    };
  }
}
