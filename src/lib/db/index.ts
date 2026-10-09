import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

/**
 * Database access. Production uses Postgres over DATABASE_URL (for example Neon from the Vercel Marketplace);
 * local development without DATABASE_URL uses an embedded PGlite database in ./.data, migrated on first use.
 * Customer data is never kept in memory: production refuses to start without DATABASE_URL.
 */

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;
export { schema };

const MIGRATIONS = path.join(process.cwd(), "drizzle");

// Kept on globalThis so development hot reloads and separately compiled routes share one connection
// (the embedded database can only be opened once per process).
const shared = globalThis as unknown as { __fluxlineDb?: Promise<Db> | null };
let override: Db | null = null;

async function connect(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { default: postgres } = await import("postgres");
    const { drizzle } = await import("drizzle-orm/postgres-js");
    // Serverless-friendly: a small pool per instance; prepare:false works with transaction-mode poolers.
    const client = postgres(url, { max: 3, prepare: false, idle_timeout: 20 });
    return drizzle(client, { schema }) as unknown as Db;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is not set. Billing and the client portal need a Postgres database.");
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  const dir = path.join(process.cwd(), ".data", "pglite");
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: MIGRATIONS });
  return db as unknown as Db;
}

export function getDb(): Promise<Db> {
  if (override) return Promise.resolve(override);
  shared.__fluxlineDb ??= connect().catch((error) => {
    shared.__fluxlineDb = null;
    throw error;
  });
  return shared.__fluxlineDb;
}

/** Tests inject an in-memory database. */
export function setDbForTests(db: Db | null) {
  override = db;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL) || process.env.NODE_ENV !== "production";
}
