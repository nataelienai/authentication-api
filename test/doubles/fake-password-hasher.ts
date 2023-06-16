import { PasswordHasher } from '@/application/ports/password-hasher';
import { HashedPassword } from '@/domain/hashed-password';
import { Password } from '@/domain/password';

export class FakePasswordHasher implements PasswordHasher {
  private readonly hashPrefix = 'HASHED:';

  hash(password: Password): Promise<HashedPassword> {
    return Promise.resolve(
      new HashedPassword(this.hashPrefix + password.value),
    );
  }

  compare(
    plainTextPassword: string,
    hashedPassword: HashedPassword,
  ): Promise<boolean> {
    return Promise.resolve(
      hashedPassword.value === this.hashPrefix + plainTextPassword,
    );
  }
}
