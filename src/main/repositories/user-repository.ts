import { UserRepository } from '@/application/ports/user-repository';
import { PrismaUserRepository } from '@/infra/database/prisma-user-repository';
import { getPrismaClient } from '../connections/prisma';

let userRepository: UserRepository;

export function getUserRepository() {
  if (!userRepository) {
    userRepository = new PrismaUserRepository(getPrismaClient());
  }
  return userRepository;
}
