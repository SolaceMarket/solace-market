import { client } from "@/turso/database";
import { randomUUID } from "crypto";
import type {
  Transaction,
  TransactionWithAsset,
  CreateTransactionRequest,
} from "@/data/portfolioTypes";
import { createOrUpdateHolding } from "@/data/holdingsService";

export const getTransactionsByPortfolioId = async (
  portfolioId: string,
  limit: number = 50,
): Promise<TransactionWithAsset[]> => {
  const query = `
    SELECT 
      t.*,
      a.name as asset_name,
      a.class as asset_class,
      a.exchange as asset_exchange
    FROM transactions t
    LEFT JOIN assets a ON t.asset_id = a.id
    WHERE t.portfolio_id = ?
    ORDER BY t.transaction_date DESC, t.created_at DESC
    LIMIT ?
  `;

  try {
    const result = await client.execute({
      sql: query,
      args: [portfolioId, limit],
    });

    return result.rows.map((row) => ({
      id: row.id as string,
      portfolio_id: row.portfolio_id as string,
      asset_id: row.asset_id as string,
      symbol: row.symbol as string,
      type: row.type as Transaction["type"],
      quantity: row.quantity as number,
      price: row.price as number,
      total_value: row.total_value as number,
      fee: row.fee as number,
      notes: row.notes as string | undefined,
      transaction_date: row.transaction_date as string,
      created_at: row.created_at as string,
      asset_name: (row.asset_name as string) || "",
      asset_class: (row.asset_class as string) || "",
      asset_exchange: (row.asset_exchange as string) || "",
    }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const getTransactionById = async (
  transactionId: string,
): Promise<Transaction | null> => {
  const query = "SELECT * FROM transactions WHERE id = ?";

  try {
    const result = await client.execute({
      sql: query,
      args: [transactionId],
    });

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id as string,
      portfolio_id: row.portfolio_id as string,
      asset_id: row.asset_id as string,
      symbol: row.symbol as string,
      type: row.type as Transaction["type"],
      quantity: row.quantity as number,
      price: row.price as number,
      total_value: row.total_value as number,
      fee: row.fee as number,
      notes: row.notes as string | undefined,
      transaction_date: row.transaction_date as string,
      created_at: row.created_at as string,
    };
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }
};

export const createTransaction = async (
  request: CreateTransactionRequest,
): Promise<Transaction> => {
  const transactionId = randomUUID();
  const now = new Date().toISOString();
  const transactionDate = request.transaction_date || now;

  // Calculate total value
  const totalValue = request.quantity * request.price + (request.fee || 0);

  const query = `
    INSERT INTO transactions (
      id, portfolio_id, asset_id, symbol, type, quantity, price,
      total_value, fee, notes, transaction_date, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await client.execute({
      sql: query,
      args: [
        transactionId,
        request.portfolio_id,
        request.asset_id,
        "", // Will be filled by asset lookup
        request.type,
        request.quantity,
        request.price,
        totalValue,
        request.fee || 0,
        request.notes || null,
        transactionDate,
        now,
      ],
    });

    // Update holdings if this is a buy/sell transaction
    if (request.type === "buy" || request.type === "sell") {
      const quantity =
        request.type === "buy" ? request.quantity : -request.quantity;

      // Get asset symbol
      const assetResult = await client.execute({
        sql: "SELECT symbol FROM assets WHERE id = ?",
        args: [request.asset_id],
      });

      if (assetResult.rows.length > 0) {
        const symbol = assetResult.rows[0].symbol as string;

        // Update transaction with symbol
        await client.execute({
          sql: "UPDATE transactions SET symbol = ? WHERE id = ?",
          args: [symbol, transactionId],
        });

        // Update holdings
        await createOrUpdateHolding(
          request.portfolio_id,
          request.asset_id,
          symbol,
          quantity,
          request.price,
        );
      }
    }

    const transaction = await getTransactionById(transactionId);
    if (!transaction) {
      throw new Error("Failed to create transaction");
    }

    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

export const updateTransaction = async (
  transactionId: string,
  updates: Partial<
    Pick<
      Transaction,
      "type" | "quantity" | "price" | "fee" | "notes" | "transaction_date"
    >
  >,
): Promise<Transaction | null> => {
  // Build dynamic update query
  const updateFields = Object.keys(updates).map((key) => `${key} = ?`);

  if (updateFields.length === 0) {
    return await getTransactionById(transactionId);
  }

  // Recalculate total_value if quantity, price, or fee is updated
  let totalValue: number | undefined;
  if ("quantity" in updates || "price" in updates || "fee" in updates) {
    const existing = await getTransactionById(transactionId);
    if (existing) {
      const quantity = updates.quantity ?? existing.quantity;
      const price = updates.price ?? existing.price;
      const fee = updates.fee ?? existing.fee;
      totalValue = quantity * price + fee;

      updateFields.push("total_value = ?");
    }
  }

  const query = `
    UPDATE transactions 
    SET ${updateFields.join(", ")}
    WHERE id = ?
  `;

  const args = [
    ...Object.values(updates),
    ...(totalValue !== undefined ? [totalValue] : []),
    transactionId,
  ];

  try {
    await client.execute({
      sql: query,
      args,
    });

    return await getTransactionById(transactionId);
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

export const deleteTransaction = async (
  transactionId: string,
): Promise<boolean> => {
  const query = "DELETE FROM transactions WHERE id = ?";

  try {
    const result = await client.execute({
      sql: query,
      args: [transactionId],
    });

    return result.rowsAffected > 0;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

export const getPortfolioStats = async (portfolioId: string) => {
  const query = `
    SELECT 
      COUNT(*) as total_transactions,
      SUM(CASE WHEN type = 'buy' THEN total_value ELSE 0 END) as total_invested,
      SUM(CASE WHEN type = 'sell' THEN total_value ELSE 0 END) as total_sold,
      SUM(CASE WHEN type = 'dividend' THEN total_value ELSE 0 END) as total_dividends,
      SUM(fee) as total_fees
    FROM transactions 
    WHERE portfolio_id = ?
  `;

  try {
    const result = await client.execute({
      sql: query,
      args: [portfolioId],
    });

    const row = result.rows[0];
    return {
      total_transactions: row.total_transactions as number,
      total_invested: (row.total_invested as number) || 0,
      total_sold: (row.total_sold as number) || 0,
      total_dividends: (row.total_dividends as number) || 0,
      total_fees: (row.total_fees as number) || 0,
    };
  } catch (error) {
    console.error("Error fetching portfolio stats:", error);
    throw error;
  }
};
