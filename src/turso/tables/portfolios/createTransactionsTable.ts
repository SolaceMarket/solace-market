import { client } from "@/turso/database";

export const createTransactionsTable = async () => {
  const createTransactionsTableQuery = `
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      portfolio_id TEXT NOT NULL,
      asset_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'deposit', 'withdrawal', 'dividend', 'fee')),
      quantity REAL NOT NULL DEFAULT 0,
      price REAL NOT NULL DEFAULT 0,
      total_value REAL NOT NULL DEFAULT 0,
      fee REAL DEFAULT 0,
      notes TEXT,
      transaction_date DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) ON DELETE CASCADE,
      FOREIGN KEY (asset_id) REFERENCES assets (id)
    );
  `;

  try {
    await client.execute(createTransactionsTableQuery);
    console.log("✅ Transactions table created successfully");
  } catch (error) {
    console.error("❌ Error creating transactions table:", error);
    throw error;
  }
};
