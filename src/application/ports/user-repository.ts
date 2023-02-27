import { User } from '@/domain/user';

export interface UserRepository {
  create(user: User): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
}
