import { TokenService } from '@/application/ports/token-service';
import { JwtTokenService } from '@/infra/services/jwt-token-service';

let tokenService: TokenService;

export function getTokenService() {
  if (!tokenService) {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? '';
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET ?? '';
    tokenService = new JwtTokenService(accessTokenSecret, refreshTokenSecret);
  }
  return tokenService;
}
