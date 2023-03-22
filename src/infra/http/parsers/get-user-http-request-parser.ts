import { GetUserRequest } from '@/application/use-cases/get-user';
import { HttpRequest } from '@/presentation/ports/http-request';
import { z } from 'zod';
import { authorizationSchema } from './schemas/authorization-schema';
import { ZodHttpRequestParser } from './zod-http-request-parser';

export class GetUserHttpRequestParser extends ZodHttpRequestParser<GetUserRequest> {
  // eslint-disable-next-line class-methods-use-this
  protected parseRequest(request: HttpRequest): GetUserRequest {
    const schema = z.object({
      authorization: authorizationSchema,
    });
    const parsedSchema = schema.parse(request.headers);

    return { accessToken: parsedSchema.authorization };
  }
}
