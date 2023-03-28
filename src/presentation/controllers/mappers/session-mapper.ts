import { Session } from '@/domain/session';

export type SessionDto = {
  accessToken: string;
  refreshToken: string;
};

export const SessionMapper = {
  mapToDto(session: Session): SessionDto {
    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  },
};
