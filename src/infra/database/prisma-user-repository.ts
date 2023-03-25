import { UserRepository } from '@/application/ports/user-repository';
import { Email } from '@/domain/email';
import { HashedPassword } from '@/domain/hashed-password';
import { User } from '@/domain/user';
import { PrismaClient, User as StoredUser } from '@prisma/client';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email.value,
        hashedPassword: user.hashedPassword.value,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const storedUser = await this.prisma.user.findUnique({ where: { email } });

    return Boolean(storedUser);
  }

  async existsById(id: string): Promise<boolean> {
    const storedUser = await this.prisma.user.findUnique({ where: { id } });

    return Boolean(storedUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const storedUser = await this.prisma.user.findUnique({ where: { email } });

    if (!storedUser) {
      return undefined;
    }

    return PrismaUserRepository.mapToDomainUser(storedUser);
  }

  async findById(id: string): Promise<User | undefined> {
    const storedUser = await this.prisma.user.findUnique({ where: { id } });

    if (!storedUser) {
      return undefined;
    }

    return PrismaUserRepository.mapToDomainUser(storedUser);
  }

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email.value,
        hashedPassword: user.hashedPassword.value,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private static mapToDomainUser(storedUser: StoredUser): User {
    const errorOrEmail = Email.create(storedUser.email);

    if (errorOrEmail.isLeft()) {
      throw new Error(
        `Stored user with id '${storedUser.id}' has an invalid email`,
      );
    }

    const hashedPassword = new HashedPassword(storedUser.hashedPassword);
    const errorOrUser = User.create({
      id: storedUser.id,
      email: errorOrEmail.value,
      createdAt: storedUser.createdAt,
      updatedAt: storedUser.updatedAt,
      hashedPassword,
    });

    if (errorOrUser.isLeft()) {
      throw new Error(`Stored user with id '${storedUser.id}' is invalid`);
    }

    return errorOrUser.value;
  }
}
