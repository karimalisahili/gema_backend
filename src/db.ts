import 'dotenv/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export class DB {
  static instance: DB;
  ssl = process.env.SSL === 'true' ? true : false;
  databaseUrl = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${
    process.env.PGSERVER
  }:${process.env.PGPORT}/${process.env.PGNAME}${this.ssl ? '?ssl=true' : ''}`;
  pool = new Pool({
    connectionString: this.databaseUrl,
    ssl: this.ssl,
  });
  db = drizzle({ client: this.pool });

  public constructor() {}

  static getInstance(): DB {
    if (!DB.instance) {
      DB.instance = new DB();
    } else {
      console.log('Ya la instancia ha sido creada');
    }
    return DB.instance;
  }

  static getDB(): NodePgDatabase {
    return DB.getInstance().db;
  }

  static getPool(): Pool {
    return DB.getInstance().pool;
  }
}

export const db: NodePgDatabase = DB.getDB();
