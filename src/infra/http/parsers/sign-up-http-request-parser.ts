import { SignUpRequest } from '@/application/use-cases/sign-up';
import { HttpRequest } from '@/presentation/ports/http-request';
import { z } from 'zod';
import { ZodHttpRequestParser } from './zod-http-request-parser';

export class SignUpHttpRequestParser extends ZodHttpRequestParser<SignUpRequest> {
  // eslint-disable-next-line class-methods-use-this
  protected parseRequest(request: HttpRequest): SignUpRequest {
    const schema = z.object({
      email: z.string(),
      password: z.string(),
    });

    return schema.parse(request.body);
  }
}
