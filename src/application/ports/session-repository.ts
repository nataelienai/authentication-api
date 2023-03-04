import { Session } from '@/domain/session';

export interface SessionRepository {
  create(session: Session): Promise<void>;
  update(session: Session): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<Session | null>;
  existsByAccessToken(accessToken: string): Promise<boolean>;
  deleteByAccessToken(accessToken: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
}
