import { client } from "@/turso//database";

export const createAssetsTable = async () => {
  try {
    const result = await client.execute(
      `CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        class TEXT,
        exchange TEXT,
        symbol TEXT,
        name TEXT,
        status TEXT,
        tradable BOOLEAN,
        marginable BOOLEAN,
        maintenance_margin_requirement REAL,
        margin_requirement_long TEXT,
        margin_requirement_short TEXT,
        shortable BOOLEAN,
        easy_to_borrow BOOLEAN,
        fractionable BOOLEAN,
        ptp_no_exception BOOLEAN DEFAULT FALSE,
        ptp_with_exception BOOLEAN DEFAULT FALSE,
        ipo BOOLEAN DEFAULT FALSE,
        has_options BOOLEAN DEFAULT FALSE,
        options_late_close BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deleted_at DATETIME DEFAULT NULL
        );`,
    );
    console.log("Created assets table", result);
    return result;
  } catch (error) {
    console.error("Error creating assets table", error);
    return { error: (error as Error).message };
  }
};
