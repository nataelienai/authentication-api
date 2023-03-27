import { PrismaClient } from '@prisma/client';
import { getLogger } from './logger';

let prismaClient: PrismaClient;

export async function getPrismaClient() {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
    await prismaClient.$connect();

    const logger = getLogger();
    logger.info('Prisma Client: connected successfully');
  }
  return prismaClient;
}
