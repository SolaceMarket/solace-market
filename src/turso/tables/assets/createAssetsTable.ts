import { client } from "@/turso//database";

export const createAssetsTable = async () => {
  try {
    // Create table if not exists
    const result = await client.execute(
      `CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        class TEXT,
        exchange TEXT,
        symbol TEXT,
        name TEXT UNIQUE,
        status TEXT,
        tradable BOOLEAN,
        marginable BOOLEAN,
        maintenance_margin_requirement REAL,
        margin_requirement_long TEXT,
        margin_requirement_short TEXT,
        shortable BOOLEAN,
        easy_to_borrow BOOLEAN,
        fractionable BOOLEAN,
        attributes TEXT
        );`,
    );
    console.log("Created assets table", result);
    return result;
  } catch (error) {
    console.error("Error creating assets table", error);
    return { error: (error as Error).message };
  }
};
