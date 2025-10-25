import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle/client";
import { assetsTable } from "@/database/drizzle/schemas/assets";

/**
 * Check if an asset already exists in the database
 */
export async function assetExists(assetId: string): Promise<boolean> {
  try {
    const result = await db
      .select({ id: assetsTable.id })
      .from(assetsTable)
      .where(eq(assetsTable.id, assetId))
      .limit(1);
    return result.length > 0;
  } catch (error) {
    console.error(`Error checking if asset ${assetId} exists:`, error);
    return false;
  }
}
