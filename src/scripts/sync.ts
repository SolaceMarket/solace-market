import { getAssets } from "@/alpaca/assets/getAssets";
import { insertAsset } from "@/turso/tables/assets/insertAsset";
import { createDatabaseTables } from "@/turso/database";

export async function importAssets() {
  const assets = await getAssets();
  for (const asset of assets) {
    await insertAsset(asset);
  }
}

export const sync = async () => {
  await createDatabaseTables();
  // await importAssets();
};

await sync();
