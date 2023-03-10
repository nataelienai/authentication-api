import { User } from '@/domain/user';

export interface UserRepository {
  create(user: User): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
  existsById(id: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(user: User): Promise<void>;
  deleteById(id: string): Promise<void>;
}
