export interface TokenService {
  encode(userId: string): Promise<string>;
}
