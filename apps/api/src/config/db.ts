import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../db/schema';

// This assumes process.env.DATABASE_URL is available
const sql = neon(process.env.DATABASE_URL || 'postgresql://user:pass@host/db');
export const db = drizzle(sql, { schema });
