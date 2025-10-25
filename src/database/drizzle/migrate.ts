import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { getSQLiteClient } from "./client";
import * as schema from "./schema";

export const createDatabaseTables = async () => {
  try {
    // Get the SQLite client for migrations
    const client = getSQLiteClient();

    // Run migrations using Drizzle
    const drizzleDb = drizzle(client, { schema });

    console.log("Running Drizzle migrations...");
    await migrate(drizzleDb, {
      migrationsFolder: "./src/database/drizzle/migrations",
    });

    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Error running database migrations:", error);
    throw error;
  }
};
