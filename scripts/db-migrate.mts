/**
 * Applies database migrations (./drizzle) to the Postgres database in DATABASE_URL.
 * Run once after creating the database, and again after pulling schema changes:
 *   DATABASE_URL=... npm run db:migrate
 */
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}
const client = postgres(url, { max: 1 });
await migrate(drizzle(client), { migrationsFolder: "drizzle" });
await client.end();
console.log("Migrations applied.");
