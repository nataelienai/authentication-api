import { SessionRepository } from '@/application/ports/session-repository';
import { Session } from '@/domain/session';

export class InMemorySessionRepository implements SessionRepository {
  private sessions: Session[] = [];

  create(session: Session): Promise<void> {
    this.sessions.push(session);
    return Promise.resolve();
  }

  update(session: Session): Promise<void> {
    const index = this.sessions.findIndex((s) => s.id === session.id);
    if (index >= 0) {
      // eslint-disable-next-line security/detect-object-injection
      this.sessions[index] = session;
    }
    return Promise.resolve();
  }

  findById(sessionId: string): Promise<Session | undefined> {
    const session = this.sessions.find((s) => s.id === sessionId);
    return Promise.resolve(session);
  }

  existsById(sessionId: string): Promise<boolean> {
    const sessionExists = this.sessions.some((s) => s.id === sessionId);
    return Promise.resolve(sessionExists);
  }

  deleteById(sessionId: string): Promise<void> {
    this.sessions = this.sessions.filter((s) => s.id !== sessionId);
    return Promise.resolve();
  }

  deleteAllByUserId(userId: string): Promise<void> {
    this.sessions = this.sessions.filter((s) => s.userId !== userId);
    return Promise.resolve();
  }
}
