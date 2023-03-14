/* eslint-disable class-methods-use-this */
import bcrypt from 'bcrypt';
import { PasswordHasher } from '@/application/ports/password-hasher';
import { HashedPassword } from '@/domain/hashed-password';
import { Password } from '@/domain/password';

export class BcryptPasswordHasher implements PasswordHasher {
  private static readonly SALT_ROUNDS = 12;

  async hash(password: Password) {
    const hashedPassword = await bcrypt.hash(
      password.value,
      BcryptPasswordHasher.SALT_ROUNDS,
    );

    return new HashedPassword(hashedPassword);
  }

  async compare(plainTextPassword: string, hashedPassword: HashedPassword) {
    return bcrypt.compare(plainTextPassword, hashedPassword.value);
  }
}
