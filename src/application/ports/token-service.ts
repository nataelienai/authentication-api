import { Either } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';

export interface TokenService {
  encode(userId: string): Promise<string>;
  decode(token: string): Promise<Either<InvalidTokenError, string>>;
}
