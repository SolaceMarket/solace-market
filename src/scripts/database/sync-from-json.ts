import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Asset } from "@/alpaca/assets/Asset";
import { client, createDatabaseTables } from "@/turso/database";
import { insertAsset } from "@/turso/tables/assets/insertAsset";

interface AssetJsonData {
  id: string;
  class: string;
  exchange: string;
  symbol: string;
  name: string;
  status: string;
  tradable: boolean;
  marginable: boolean;
  maintenance_margin_requirement: number;
  margin_requirement_long: string;
  margin_requirement_short: string;
  shortable: boolean;
  easy_to_borrow: boolean;
  fractionable: boolean;
  attributes: string[];
}

// Function to process attributes array and return boolean flags
function processAttributeFlags(attributes: string[]) {
  return {
    ptp_no_exception: attributes.includes("ptp_no_exception"),
    ptp_with_exception: attributes.includes("ptp_with_exception"),
    ipo: attributes.includes("ipo"),
    has_options: attributes.includes("has_options"),
    options_late_close: attributes.includes("options_late_close"),
  };
}

// Function to check if an asset already exists in the database
async function assetExists(assetId: string): Promise<boolean> {
  try {
    const result = await client.execute(
      "SELECT id FROM assets WHERE id = ? LIMIT 1",
      [assetId],
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error(`Error checking if asset ${assetId} exists:`, error);
    return false;
  }
}

export async function importAssetsFromJson() {
  console.log("Starting asset import from assets.json...");

  try {
    // Read the assets.json file
    const assetsFilePath = join(process.cwd(), "data", "assets.json");
    const assetsJsonContent = readFileSync(assetsFilePath, "utf-8");
    const assetsData: AssetJsonData[] = JSON.parse(assetsJsonContent);

    console.log(`Found ${assetsData.length} assets in assets.json`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    // Process assets in batches to avoid overwhelming the database
    const batchSize = 100;
    const totalBatches = Math.ceil(assetsData.length / batchSize);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * batchSize;
      const endIndex = Math.min(startIndex + batchSize, assetsData.length);
      const batch = assetsData.slice(startIndex, endIndex);

      console.log(
        `Processing batch ${batchIndex + 1}/${totalBatches} (${startIndex + 1}-${endIndex})`,
      );

      for (const assetData of batch) {
        try {
          // Check if asset already exists in database
          const exists = await assetExists(assetData.id);
          if (exists) {
            console.log(
              `⏭️  Skipping existing asset: ${assetData.symbol} (${assetData.id})`,
            );
            skippedCount++;
            continue;
          }

          // Convert the JSON data to the Asset type expected by insertAsset
          const attributeFlags = processAttributeFlags(assetData.attributes);

          const asset: Asset = {
            id: assetData.id,
            class: assetData.class,
            exchange: assetData.exchange,
            symbol: assetData.symbol,
            name: assetData.name,
            status: assetData.status,
            tradable: assetData.tradable,
            marginable: assetData.marginable,
            maintenance_margin_requirement:
              assetData.maintenance_margin_requirement,
            margin_requirement_long: assetData.margin_requirement_long,
            margin_requirement_short: assetData.margin_requirement_short,
            shortable: assetData.shortable,
            easy_to_borrow: assetData.easy_to_borrow,
            fractionable: assetData.fractionable,
            ...attributeFlags, // Spread the boolean flags
          };

          const result = await insertAsset(asset);

          if ("error" in result) {
            console.error(
              `Error inserting asset ${asset.symbol}:`,
              result.error,
            );
            errorCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          console.error(`Error processing asset ${assetData.symbol}:`, error);
          errorCount++;
        }
      }

      // Add a small delay between batches to prevent overwhelming the database
      if (batchIndex < totalBatches - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log(`\nAsset import completed:`);
    console.log(`✅ Successfully imported: ${successCount} assets`);
    console.log(`⏭️  Skipped existing: ${skippedCount} assets`);
    console.log(`❌ Failed to import: ${errorCount} assets`);
    console.log(
      `📊 Total processed: ${successCount + skippedCount + errorCount} assets`,
    );
  } catch (error) {
    console.error("Error reading or parsing assets.json:", error);
    throw error;
  }
}

export async function importAssetsFromJsonQuiet() {
  try {
    const assetsFilePath = join(process.cwd(), "data", "assets.json");
    const assetsJsonContent = readFileSync(assetsFilePath, "utf-8");
    const assetsData: AssetJsonData[] = JSON.parse(assetsJsonContent);

    // Instantly log the amount of items found before doing anything else
    console.log(`📊 Found ${assetsData.length} assets in assets.json`);

    for (const assetData of assetsData) {
      // Check if asset already exists in database
      const exists = await assetExists(assetData.id);
      if (exists) {
        continue; // Skip existing assets
      }

      const attributeFlags = processAttributeFlags(assetData.attributes);

      const asset: Asset = {
        id: assetData.id,
        class: assetData.class,
        exchange: assetData.exchange,
        symbol: assetData.symbol,
        name: assetData.name,
        status: assetData.status,
        tradable: assetData.tradable,
        marginable: assetData.marginable,
        maintenance_margin_requirement:
          assetData.maintenance_margin_requirement,
        margin_requirement_long: assetData.margin_requirement_long,
        margin_requirement_short: assetData.margin_requirement_short,
        shortable: assetData.shortable,
        easy_to_borrow: assetData.easy_to_borrow,
        fractionable: assetData.fractionable,
        ...attributeFlags, // Spread the boolean flags
      };

      await insertAsset(asset);
    }
  } catch (error) {
    console.error("Error in quiet asset import:", error);
    throw error;
  }
}

export const syncFromJson = async () => {
  console.log("🚀 Starting database sync from assets.json...");

  try {
    // Create database tables first
    console.log("📋 Creating database tables...");
    await createDatabaseTables();
    console.log("✅ Database tables created successfully");

    // Import assets from JSON file
    await importAssetsFromJson();

    console.log("🎉 Sync from assets.json completed successfully!");
  } catch (error) {
    console.error("💥 Sync failed:", error);
    process.exit(1);
  }
};

// Execute the sync if this file is run directly
await importAssetsFromJson();
