import { neon } from '@netlify/neon';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../../../db/schema';

// Get database connection - @netlify/neon automatically uses NETLIFY_DATABASE_URL
// It returns a function that we can use with drizzle-orm/neon-http
const sql = neon();

// Create and export Drizzle instance
export const db = drizzle(sql, { schema });

// Re-export schema for convenience
export { schema };
