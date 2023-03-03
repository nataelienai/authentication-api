import { Session } from '@/domain/session';

export interface SessionRepository {
  create(session: Session): Promise<void>;
  existsByAccessToken(accessToken: string): Promise<boolean>;
  deleteByAccessToken(accessToken: string): Promise<void>;
}
