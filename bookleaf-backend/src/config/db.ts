import { Pool } from 'pg';
import { config } from './env';

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Log successful connections
pool.on('connect', () => {
  console.log('🐘 PostgreSQL connected successfully');
});

// Handle unexpected database errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// Export a clean interface for querying the database
export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  pool,
};