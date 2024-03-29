import 'dotenv/config';
import { z } from 'zod';

const DEFAULT_PORT = 3000;

const envSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRATION_IN_SECONDS: z.coerce.number(),
  REFRESH_TOKEN_EXPIRATION_IN_SECONDS: z.coerce.number(),
  PORT: z.coerce.number().default(DEFAULT_PORT),
  REDIS_URL: z.string(),
});

export const env = envSchema.parse(process.env);
