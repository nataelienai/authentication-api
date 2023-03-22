import { DeleteUserRequest } from '@/application/use-cases/delete-user';
import { HttpRequest } from '@/presentation/ports/http-request';
import { z } from 'zod';
import { ZodHttpRequestParser } from './zod-http-request-parser';

export class DeleteUserHttpRequestParser extends ZodHttpRequestParser<DeleteUserRequest> {
  // eslint-disable-next-line class-methods-use-this
  protected parseRequest(request: HttpRequest): DeleteUserRequest {
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
