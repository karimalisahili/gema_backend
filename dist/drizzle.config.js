"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const drizzle_kit_1 = require("drizzle-kit");
const ssl = process.env.SSL === 'true' ? true : false;
const databaseUrl = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGSERVER}:${process.env.PGPORT}/${process.env.PGNAME}${ssl ? '?ssl=true' : ''}`;
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: './drizzle',
    schema: './src/tables/*.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: databaseUrl,
    },
});
