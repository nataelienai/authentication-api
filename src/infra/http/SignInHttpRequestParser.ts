import { SignInRequest } from '@/application/use-cases/sign-in';
import { HttpRequest } from '@/presentation/ports/http-request';
import { z } from 'zod';
import { ZodHttpRequestParser } from './ZodHttpRequestParser';

export class SignInHttpRequestParser extends ZodHttpRequestParser<SignInRequest> {
  // eslint-disable-next-line class-methods-use-this
  protected parseRequest(request: HttpRequest): SignInRequest {
    const schema = z.object({
      email: z.string(),
      password: z.string(),
    });

    return schema.parse(request.body);
  }
}
