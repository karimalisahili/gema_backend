import express from "express";
import { db } from "./db";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World from Express + TypeScript + Drizzle!");
});

(async () => {
  try {
    // Try a simple query to check the connection
    await db.execute("SELECT 1");
    console.log("Connected to PostgreSQL via Drizzle ORM.");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
})();
