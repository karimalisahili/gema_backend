import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const ssl = process.env.SSL === 'true' ? true : false;
const databaseUrl = `postgres://${process.env.PGUSER}:${
  process.env.PGPASSWORD
}@${process.env.PGSERVER}:${process.env.PGPORT}/${process.env.PGNAME}${
  ssl ? '?ssl=true' : ''
}`;

export default defineConfig({
  out: './drizzle',
  schema: './src/tables/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
