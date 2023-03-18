import { PasswordHasher } from '@/application/ports/password-hasher';
import { BcryptPasswordHasher } from '@/infra/services/bcrypt-password-hasher';

let passwordHasher: PasswordHasher;

export function getPasswordHasher() {
  if (!passwordHasher) {
    passwordHasher = new BcryptPasswordHasher();
  }
  return passwordHasher;
}
