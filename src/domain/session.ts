import { Optional } from '@/shared/optional';
import { randomUUID } from 'node:crypto';

interface SessionProps {
  id: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
}

type CreateSessionProps = Optional<SessionProps, 'id'>;

export class Session {
  private constructor(private readonly props: SessionProps) {}

  get id() {
    return this.props.id;
  }

  get accessToken() {
    return this.props.accessToken;
  }

  set accessToken(accessToken: string) {
    this.props.accessToken = accessToken;
  }

  get refreshToken() {
    return this.props.refreshToken;
  }

  set refreshToken(refreshToken: string) {
    this.props.refreshToken = refreshToken;
  }

  get userId() {
    return this.props.userId;
  }

  static create(props: CreateSessionProps) {
    return new Session({
      ...props,
      id: props.id ?? randomUUID(),
    });
  }
}
