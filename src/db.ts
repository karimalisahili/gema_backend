import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Configure your PostgreSQL connection
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/gemadb",
});

// Create Drizzle ORM instance
export const db = drizzle(pool);
