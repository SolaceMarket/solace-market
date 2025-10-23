import type { Asset } from "@/alpaca/assets/Asset";
import { client } from "@/turso/database";

export const insertAsset = async (asset: Asset) => {
  console.log("Inserting asset", asset);
  try {
    const result = await client.execute(
      `INSERT INTO assets (
        id,
        class,
        exchange,
        symbol,
        name,
        status,
        tradable,
        marginable,
        maintenance_margin_requirement,
        margin_requirement_long,
        margin_requirement_short,
        shortable,
        easy_to_borrow,
        fractionable,
        attributes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [...Object.values(asset)],
    );
    console.log("Inserted asset", result);
    return result;
  } catch (error) {
    console.error("Error inserting asset", error);
    return { error: (error as Error).message };
  }
};
