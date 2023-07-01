import { Either } from '@/shared/either';
import { InvalidTokenError } from '../errors/invalid-token-error';

export type DecodedPayload = {
  userId: string;
  sessionId: string;
};

export interface TokenService {
  generateAccessToken(userId: string, sessionId: string): Promise<string>;
  generateRefreshToken(userId: string, sessionId: string): Promise<string>;
  decodeAccessToken(
    token: string,
  ): Promise<Either<InvalidTokenError, DecodedPayload>>;
  decodeRefreshToken(
    token: string,
  ): Promise<Either<InvalidTokenError, DecodedPayload>>;
}
