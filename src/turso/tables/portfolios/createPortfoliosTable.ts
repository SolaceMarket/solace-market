import { client } from "@/turso/database";

export const createPortfoliosTable = async () => {
  const createPortfoliosTableQuery = `
    CREATE TABLE IF NOT EXISTS portfolios (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      total_value REAL DEFAULT 0,
      day_change_value REAL DEFAULT 0,
      day_change_percent REAL DEFAULT 0,
      total_return_value REAL DEFAULT 0,
      total_return_percent REAL DEFAULT 0,
      cash_balance REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, name)
    );
  `;

  try {
    await client.execute(createPortfoliosTableQuery);
    console.log("✅ Portfolios table created successfully");
  } catch (error) {
    console.error("❌ Error creating portfolios table:", error);
    throw error;
  }
};
