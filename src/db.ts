import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Compose the DATABASE_URL from individual environment variables
const ssl = process.env.SSL === 'true' ? true : false;
const databaseUrl = `postgres://${process.env.PGUSER}:${
  process.env.PGPASSWORD
}@${process.env.PGSERVER}:${process.env.PGPORT}/${process.env.PGNAME}${
  ssl ? '?ssl=true' : ''
}`;

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: ssl,
});

export const db = drizzle({ client: pool });
