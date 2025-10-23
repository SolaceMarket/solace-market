import { client } from "@/turso/database";

export const createHoldingsTable = async () => {
  const createHoldingsTableQuery = `
    CREATE TABLE IF NOT EXISTS holdings (
      id TEXT PRIMARY KEY,
      portfolio_id TEXT NOT NULL,
      asset_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 0,
      average_cost REAL NOT NULL DEFAULT 0,
      current_price REAL DEFAULT 0,
      market_value REAL DEFAULT 0,
      unrealized_pl REAL DEFAULT 0,
      unrealized_pl_percent REAL DEFAULT 0,
      day_change_value REAL DEFAULT 0,
      day_change_percent REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) ON DELETE CASCADE,
      FOREIGN KEY (asset_id) REFERENCES assets (id),
      UNIQUE(portfolio_id, asset_id)
    );
  `;

  try {
    await client.execute(createHoldingsTableQuery);
    console.log("✅ Holdings table created successfully");
  } catch (error) {
    console.error("❌ Error creating holdings table:", error);
    throw error;
  }
};
