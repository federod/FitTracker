import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Get database URL from environment variables (prefer NETLIFY_DATABASE_URL in Netlify environment)
const DATABASE_URL = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL or NETLIFY_DATABASE_URL environment variable is required');
}

// Create Neon client
const sql = neon(DATABASE_URL);

// Create Drizzle instance
export const db = drizzle(sql, { schema });
