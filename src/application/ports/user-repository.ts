import { User } from '@/domain/user';

export interface UserRepository {
  create(user: User): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
  existsById(id: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  update(user: User): Promise<void>;
  deleteById(id: string): Promise<void>;
}
