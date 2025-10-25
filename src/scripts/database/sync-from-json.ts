import { importAlpacaAccountsFromJson } from "./sync-from-json/accounts";
import { importAssetsFromJson } from "./sync-from-json/assets";

export const syncFromJson = async () => {
  console.log("🚀 Starting database sync from JSON files...");

  try {
    // Run database migrations to ensure tables exist
    console.log("📋 Running database migrations...");

    // Import assets from JSON file
    await importAssetsFromJson();

    // Import Alpaca accounts from JSON files
    await importAlpacaAccountsFromJson();

    console.log("🎉 Sync from JSON files completed successfully!");
  } catch (error) {
    console.error("💥 Sync failed:", error);
    process.exit(1);
  }
};

// Execute the sync if this file is run directly
await syncFromJson();
