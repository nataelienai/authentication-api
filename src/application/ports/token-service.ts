import { Either } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';

type DecodedPayload = {
  userId: string;
  tokenExpiration: number;
};

export interface TokenService {
  encode(userId: string): Promise<string>;
  decode(token: string): Promise<Either<InvalidTokenError, DecodedPayload>>;
}
