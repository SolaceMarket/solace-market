import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { afterEach, beforeAll } from "vitest";

// Setup test environment
beforeAll(async () => {
  console.log("🔧 Setting up test environment...");

  try {
    console.log("📊 Setting up test database schema...");

    const client = createClient({ url: ":memory:" });
    const db = drizzle(client);

    await migrate(db, {
      migrationsFolder: "./src/tests/database/_drizzle",
    });

    console.log("✅ Database schema ready");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    throw error;
  }

  console.log("✅ Test environment ready");
});

// Clean up after each test
afterEach(async () => {});
