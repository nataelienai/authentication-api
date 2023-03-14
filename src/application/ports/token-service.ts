import { Either } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';

export type DecodedPayload = {
  userId: string;
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
  isAccessTokenValid(token: string): Promise<boolean>;
}
