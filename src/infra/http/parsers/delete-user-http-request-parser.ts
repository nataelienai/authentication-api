import { DeleteUserRequest } from '@/application/use-cases/delete-user';
import { HttpRequest } from '@/presentation/ports/http-request';
import { z } from 'zod';
import { authorizationSchema } from './schemas/authorization-schema';
import { ZodHttpRequestParser } from './zod-http-request-parser';

export class DeleteUserHttpRequestParser extends ZodHttpRequestParser<DeleteUserRequest> {
  // eslint-disable-next-line class-methods-use-this
  protected parseRequest(request: HttpRequest): DeleteUserRequest {
    const schema = z.object({
      authorization: authorizationSchema,
    });
    const parsedSchema = schema.parse(request.headers);

    return { accessToken: parsedSchema.authorization };
  }
}
