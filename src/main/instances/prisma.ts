/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient;

export async function getPrismaClient() {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
    await prismaClient.$connect();
    console.log('Prisma Client: connected successfully');
  }
  return prismaClient;
}
