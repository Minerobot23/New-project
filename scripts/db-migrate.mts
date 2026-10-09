/**
 * Applies database migrations (./drizzle) to the Postgres database in DATABASE_URL.
 *   DATABASE_URL=... npm run db:migrate
 * Also runs before every build (`--if-configured`), so a Vercel deployment with a connected database
 * creates or updates its tables automatically. Migrations are idempotent: already-applied ones are skipped.
 */
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const url = process.env.DATABASE_URL;
if (!url) {
  if (process.argv.includes("--if-configured")) {
    console.log("DATABASE_URL is not set; skipping database migrations.");
    process.exit(0);
  }
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}
const client = postgres(url, { max: 1 });
await migrate(drizzle(client), { migrationsFolder: "drizzle" });
await client.end();
console.log("Migrations applied.");
