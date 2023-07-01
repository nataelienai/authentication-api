import { Session } from '@/domain/session';

export interface SessionRepository {
  create(session: Session): Promise<void>;
  update(session: Session): Promise<void>;
  findById(sessionId: string): Promise<Session | undefined>;
  existsById(sessionId: string): Promise<boolean>;
  deleteById(sessionId: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
}
