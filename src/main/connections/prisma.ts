/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient;

export function getPrismaClient() {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
    console.log('Prisma Client: connected successfully');
  }
  return prismaClient;
}
