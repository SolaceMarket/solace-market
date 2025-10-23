import { client } from "@/turso//database";

export const createAccountsTable = async () => {
  try {
    // Create table if not exists
    const result = await client.execute(
      `CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        asset_id TEXT,
        balance REAL,
        available REAL,
        locked REAL
      );`,
    );
    console.log("Created accounts table", result);
    return result;
  } catch (error) {
    console.error("Error creating accounts table", error);
    return { error: (error as Error).message };
  }
};
