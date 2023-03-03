import { Either } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';

type DecodedPayload = {
  userId: string;
  tokenExpiration: number;
};

export interface TokenService {
  generateAccessToken(userId: string): Promise<string>;
  generateRefreshToken(userId: string): Promise<string>;
  decodeAccessToken(
    token: string,
  ): Promise<Either<InvalidTokenError, DecodedPayload>>;
  decodeRefreshToken(
    token: string,
  ): Promise<Either<InvalidTokenError, DecodedPayload>>;
}
