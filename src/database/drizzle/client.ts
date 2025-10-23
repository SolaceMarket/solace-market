import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const getSQLiteClient = async () => {
  if (process.env.NODE_ENV === "test") {
    console.log("Using in-memory SQLite for tests");

    return createClient({
      url: ":memory:",
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.log("Using development Turso database");

    const localDbFileUrl = process.env.TURSO_LOCAL_DB_FILE_URL;
    console.log("TURSO_LOCAL_DB_FILE_URL:", localDbFileUrl);

    if (localDbFileUrl) {
      console.log("Using local Turso database at", localDbFileUrl);

      return createClient({
        url: localDbFileUrl,
      });
    }
  }

  if (process.env.NODE_ENV === "production") {
    console.log("Using production Turso database");

    const url = process.env.TURSO_CONNECTION_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    console.log("TURSO_CONNECTION_URL:", url);
    console.log("TURSO_AUTH_TOKEN:", authToken);

    if (!url) {
      throw new Error("Missing TURSO_CONNECTION_URL env var");
    }
    if (!authToken) {
      throw new Error("Missing TURSO_AUTH_TOKEN env var");
    }

    // Create the libsql client for production
    return createClient({
      url,
      authToken,
    });
  }

  throw new Error("Unknown NODE_ENV, cannot determine database configuration");
};

export const client = await getSQLiteClient();

// Create the Drizzle client with schema
export const db = drizzle(client, { schema });
