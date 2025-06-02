# Gema Backend

This is a Node.js backend project using TypeScript, Express, Drizzle ORM, and PostgreSQL.

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. To run the development server:
   ```sh
   npx ts-node src/index.ts
   ```

## Project Structure

- `src/` - Source code directory
- `tsconfig.json` - TypeScript configuration
- `.github/copilot-instructions.md` - Copilot custom instructions

## Database

- Uses PostgreSQL with Drizzle ORM.
- The default database name is `gemadb` (see `src/db.ts`).
- The connection string is loaded from the `.env` file using the `DATABASE_URL` variable.
- Example `.env`:
  ```env
  DATABASE_URL=postgres://postgres:postgres@localhost:5432/gemadb
  ```
  If not set, it defaults to `postgres://postgres:postgres@localhost:5432/gemadb`.
- On server start, the app checks the database connection before listening for requests.

---

Feel free to extend this README as your project grows.
