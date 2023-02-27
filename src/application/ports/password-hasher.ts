import { HashedPassword } from '@/domain/hashed-password';
import { Password } from '@/domain/password';

export interface PasswordHasher {
  hash(password: Password): Promise<HashedPassword>;
  compare(
    plainTextPassword: string,
    hashedPassword: HashedPassword,
  ): Promise<boolean>;
}
