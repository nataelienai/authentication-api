import { User } from '@/domain/user';

export type UserDto = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export const UserMapper = {
  mapToDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
};
