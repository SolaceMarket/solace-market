import { createClient } from "@libsql/client";
import { createDatabaseTables as runDrizzleMigrations } from "@/database/drizzle/migrate";

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  throw new Error("Missing TURSO_DATABASE_URL env var");
}

const authToken = process.env.TURSO_AUTH_TOKEN;
if (!authToken) {
  throw new Error("Missing TURSO_AUTH_TOKEN env var");
}

const localDbFileUrl = process.env.TURSO_LOCAL_DB_FILE_URL;
console.log("TURSO_LOCAL_DB_FILE_URL:", localDbFileUrl);
if (localDbFileUrl) {
  // If local DB file URL is provided, use it for local development
  console.log("Using local Turso database at", localDbFileUrl);
}

export const client = createClient(
  localDbFileUrl
    ? { url: "file:local.db" }
    : {
        url,
        authToken,
      },
);

export const createDatabaseTables = async () => {
  // Use Drizzle migrations instead of raw SQL table creation
  await runDrizzleMigrations();
};
