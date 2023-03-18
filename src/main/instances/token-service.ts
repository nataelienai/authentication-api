import { TokenService } from '@/application/ports/token-service';
import { JwtTokenService } from '@/infra/services/jwt-token-service';
import { env } from '../env';

let tokenService: TokenService;

export function getTokenService() {
  if (!tokenService) {
    tokenService = new JwtTokenService(
      env.ACCESS_TOKEN_SECRET,
      env.REFRESH_TOKEN_SECRET,
    );
  }
  return tokenService;
}
