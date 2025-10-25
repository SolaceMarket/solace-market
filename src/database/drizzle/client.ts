import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const getDatabaseClientTestEnv = () => {
  console.log("Using in-memory SQLite for migrations");
  return createClient({ url: ":memory:" });
};

export const getDatabaseClientDevelopmentEnv = () => {
  console.log("Running migrations on development database");
  const localDbFileUrl = process.env.TURSO_LOCAL_DB_FILE_URL;
  if (!localDbFileUrl) {
    throw new Error("Missing TURSO_LOCAL_DB_FILE_URL env var");
  }

  console.log("Using local Turso database at", localDbFileUrl);
  return createClient({ url: localDbFileUrl });
};

export const getDatabaseClientProductionEnv = () => {
  console.log("Running migrations on production database");
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("Missing TURSO_DATABASE_URL env var");
  }

  if (!authToken) {
    throw new Error("Missing TURSO_AUTH_TOKEN env var");
  }

  return createClient({ url, authToken });
};

export const getSQLiteClient = () => {
  if (process.env.NODE_ENV === "test") {
    return getDatabaseClientTestEnv();
  }

  if (process.env.NODE_ENV === "development") {
    return getDatabaseClientDevelopmentEnv();
  }

  if (process.env.NODE_ENV === "production") {
    return getDatabaseClientProductionEnv();
  }

  // TODO: We should probably not have a fallback here
  //
  //   throw new Error(
  //     "Unknown NODE_ENV, cannot determine database configuration",
  //   );
  //
  // development as fallback
  return getDatabaseClientDevelopmentEnv();
};

const client = getSQLiteClient();

// Create the Drizzle client with schema
export const db = drizzle(client, { schema });
