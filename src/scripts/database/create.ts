import { createDatabaseTables } from "@/turso/database";

console.log("Creating database tables...");

await createDatabaseTables();

console.log("Database tables created successfully.");
