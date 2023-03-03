type TokenPayload = {
  token: string;
  tokenExpiration: number;
};

export interface SessionRepository {
  create(tokenPayload: TokenPayload): Promise<void>;
  existsByAccessToken(accessToken: string): Promise<boolean>;
}
