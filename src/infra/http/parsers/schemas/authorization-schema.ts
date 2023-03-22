import { z } from 'zod';

export const authorizationSchema = z
  .string()
  .startsWith('Bearer ')
  .transform((token) => token.split('Bearer ')[1]);
