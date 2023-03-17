import { UserRepository } from '@/application/ports/user-repository';
import { PrismaUserRepository } from '@/infra/database/prisma-user-repository';
import { getPrismaClient } from '../connections/prisma';

let userRepository: UserRepository;

export async function getUserRepository() {
  if (!userRepository) {
    userRepository = new PrismaUserRepository(await getPrismaClient());
  }
  return userRepository;
}
