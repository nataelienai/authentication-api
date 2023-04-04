import { SessionRepository } from '@/application/ports/session-repository';
import { Session } from '@/domain/session';

export class InMemorySessionRepository implements SessionRepository {
  private sessions: Session[] = [];

  create(session: Session): Promise<void> {
    this.sessions.push(session);

    return Promise.resolve();
  }

  update(session: Session): Promise<void> {
    const index = this.sessions.findIndex(
      (savedSession) => savedSession.id === session.id,
    );

    if (index >= 0) {
      // eslint-disable-next-line security/detect-object-injection
      this.sessions[index] = session;
    }

    return Promise.resolve();
  }

  findByRefreshToken(refreshToken: string): Promise<Session | undefined> {
    const session = this.sessions.find(
      (savedSession) => savedSession.refreshToken === refreshToken,
    );

    return Promise.resolve(session);
  }

  existsByAccessToken(accessToken: string): Promise<boolean> {
    const session = this.sessions.some(
      (savedSession) => savedSession.accessToken === accessToken,
    );

    return Promise.resolve(session);
  }

  deleteByAccessToken(accessToken: string): Promise<void> {
    this.sessions = this.sessions.filter(
      (session) => session.accessToken !== accessToken,
    );

    return Promise.resolve();
  }

  deleteAllByUserId(userId: string): Promise<void> {
    this.sessions = this.sessions.filter(
      (session) => session.userId !== userId,
    );

    return Promise.resolve();
  }
}
