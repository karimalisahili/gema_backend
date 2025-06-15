import express from "express";
import { db } from "./db";
import routes from "./routes";

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use("/", routes);

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
