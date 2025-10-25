import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Asset } from "@/alpaca/assets/Asset";
import { db } from "@/database/drizzle/client";
import {
  assetsTable,
  type InsertAsset,
} from "@/database/drizzle/schemas/assets";
import { assetExists } from "@/services/assets/assetService";

// Type for asset data as it appears in the JSON file (with attributes array instead of individual boolean flags)
export type AssetJsonData = Omit<
  Asset,
  | "ptp_no_exception"
  | "ptp_with_exception"
  | "ipo"
  | "has_options"
  | "options_late_close"
> & {
  attributes: string[];
};

// Function to process attributes array and return boolean flags matching Asset type
function processAttributeFlags(attributes: string[]) {
  return {
    ptp_no_exception: attributes.includes("ptp_no_exception"),
    ptp_with_exception: attributes.includes("ptp_with_exception"),
    ipo: attributes.includes("ipo"),
    has_options: attributes.includes("has_options"),
    options_late_close: attributes.includes("options_late_close"),
  };
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

          // Convert the JSON data directly to InsertAsset format for Drizzle
          const attributeFlags = processAttributeFlags(assetData.attributes);

          const insertAsset: InsertAsset = {
            id: assetData.id,
            class: assetData.class,
            exchange: assetData.exchange,
            symbol: assetData.symbol,
            name: assetData.name,
            status: assetData.status,
            tradable: assetData.tradable,
            marginable: assetData.marginable,
            maintenanceMarginRequirement:
              assetData.maintenance_margin_requirement,
            marginRequirementLong: assetData.margin_requirement_long,
            marginRequirementShort: assetData.margin_requirement_short,
            shortable: assetData.shortable,
            easyToBorrow: assetData.easy_to_borrow,
            fractionable: assetData.fractionable,
            ptpNoException: attributeFlags.ptp_no_exception,
            ptpWithException: attributeFlags.ptp_with_exception,
            ipo: attributeFlags.ipo,
            hasOptions: attributeFlags.has_options,
            optionsLateClose: attributeFlags.options_late_close,
          };

          // Insert asset using Drizzle
          await db.insert(assetsTable).values(insertAsset);
          successCount++;
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
