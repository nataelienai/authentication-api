type TokenPayload = {
  token: string;
  tokenExpiration: number;
};

export interface BlacklistedTokenRepository {
  create(tokenPayload: TokenPayload): Promise<void>;
  exists(token: string): Promise<boolean>;
}
