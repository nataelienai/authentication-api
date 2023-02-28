import { User } from '@/domain/user';

export interface UserRepository {
  create(user: User): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
  existsById(userId: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
  update(user: User): Promise<void>;
  deleteById(userId: string): Promise<void>;
}
