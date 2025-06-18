"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
require("dotenv/config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
// Compose the DATABASE_URL from individual environment variables
const ssl = process.env.SSL === 'true' ? true : false;
const databaseUrl = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGSERVER}:${process.env.PGPORT}/${process.env.PGNAME}${ssl ? '?ssl=true' : ''}`;
const pool = new pg_1.Pool({
    connectionString: databaseUrl,
    ssl: ssl
});
exports.db = (0, node_postgres_1.drizzle)({ client: pool });
