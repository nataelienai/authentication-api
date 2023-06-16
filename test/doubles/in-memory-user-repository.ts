import { UserRepository } from '@/application/ports/user-repository';
import { User } from '@/domain/user';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  create(user: User): Promise<void> {
    this.users.push(user);
    return Promise.resolve();
  }

  existsByEmail(email: string): Promise<boolean> {
    return Promise.resolve(
      this.users.some((user) => user.email.value === email),
    );
  }

  existsById(id: string): Promise<boolean> {
    return Promise.resolve(this.users.some((user) => user.id === id));
  }

  findByEmail(email: string): Promise<User | undefined> {
    const userFound = this.users.find((user) => user.email.value === email);
    return Promise.resolve(userFound);
  }

  findById(id: string): Promise<User | undefined> {
    const userFound = this.users.find((user) => user.id === id);
    return Promise.resolve(userFound);
  }

  update(user: User): Promise<void> {
    const index = this.users.findIndex((savedUser) => savedUser.id === user.id);

    if (index >= 0) {
      // eslint-disable-next-line security/detect-object-injection
      this.users[index] = user;
    }

    return Promise.resolve();
  }

  deleteById(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
    return Promise.resolve();
  }
}
