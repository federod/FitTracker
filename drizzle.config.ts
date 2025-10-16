import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL!,
  },
} satisfies Config;
