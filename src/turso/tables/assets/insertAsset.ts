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
        ptp_no_exception,
        ptp_with_exception,
        ipo,
        has_options,
        options_late_close
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        asset.id,
        asset.class,
        asset.exchange,
        asset.symbol,
        asset.name,
        asset.status,
        asset.tradable,
        asset.marginable,
        asset.maintenance_margin_requirement,
        asset.margin_requirement_long,
        asset.margin_requirement_short,
        asset.shortable,
        asset.easy_to_borrow,
        asset.fractionable,
        asset.ptp_no_exception,
        asset.ptp_with_exception,
        asset.ipo,
        asset.has_options,
        asset.options_late_close,
      ],
    );
    console.log("Inserted asset", result);
    return result;
  } catch (error) {
    console.error("Error inserting asset", error);
    return { error: (error as Error).message };
  }
};
