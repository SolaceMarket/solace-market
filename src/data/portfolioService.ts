import { client } from "@/turso/database";
import { randomUUID } from "crypto";
import type { Portfolio, CreatePortfolioRequest } from "@/data/portfolioTypes";

export const getPortfoliosByUserId = async (
  userId: string,
): Promise<Portfolio[]> => {
  const query = `
    SELECT * FROM portfolios 
    WHERE user_id = ? 
    ORDER BY updated_at DESC
  `;

  try {
    const result = await client.execute({
      sql: query,
      args: [userId],
    });

    return result.rows.map((row) => ({
      id: row.id as string,
      user_id: row.user_id as string,
      name: row.name as string,
      description: row.description as string | undefined,
      total_value: row.total_value as number,
      day_change_value: row.day_change_value as number,
      day_change_percent: row.day_change_percent as number,
      total_return_value: row.total_return_value as number,
      total_return_percent: row.total_return_percent as number,
      cash_balance: row.cash_balance as number,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    }));
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    throw error;
  }
};

export const getPortfolioById = async (
  portfolioId: string,
  userId: string,
): Promise<Portfolio | null> => {
  const query = `
    SELECT * FROM portfolios 
    WHERE id = ? AND user_id = ?
  `;

  try {
    const result = await client.execute({
      sql: query,
      args: [portfolioId, userId],
    });

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id as string,
      user_id: row.user_id as string,
      name: row.name as string,
      description: row.description as string | undefined,
      total_value: row.total_value as number,
      day_change_value: row.day_change_value as number,
      day_change_percent: row.day_change_percent as number,
      total_return_value: row.total_return_value as number,
      total_return_percent: row.total_return_percent as number,
      cash_balance: row.cash_balance as number,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    throw error;
  }
};

export const createPortfolio = async (
  userId: string,
  request: CreatePortfolioRequest,
): Promise<Portfolio> => {
  const portfolioId = randomUUID();
  const now = new Date().toISOString();

  const query = `
    INSERT INTO portfolios (
      id, user_id, name, description, cash_balance, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await client.execute({
      sql: query,
      args: [
        portfolioId,
        userId,
        request.name,
        request.description || null,
        request.initial_cash || 0,
        now,
        now,
      ],
    });

    const portfolio = await getPortfolioById(portfolioId, userId);
    if (!portfolio) {
      throw new Error("Failed to create portfolio");
    }

    return portfolio;
  } catch (error) {
    console.error("Error creating portfolio:", error);
    throw error;
  }
};

export const updatePortfolio = async (
  portfolioId: string,
  userId: string,
  updates: Partial<
    Pick<
      Portfolio,
      | "name"
      | "description"
      | "total_value"
      | "day_change_value"
      | "day_change_percent"
      | "total_return_value"
      | "total_return_percent"
      | "cash_balance"
    >
  >,
): Promise<Portfolio | null> => {
  const now = new Date().toISOString();

  // Build dynamic update query
  const updateFields = Object.keys(updates).map((key) => `${key} = ?`);
  updateFields.push("updated_at = ?");

  const query = `
    UPDATE portfolios 
    SET ${updateFields.join(", ")}
    WHERE id = ? AND user_id = ?
  `;

  const args = [...Object.values(updates), now, portfolioId, userId];

  try {
    await client.execute({
      sql: query,
      args,
    });

    return await getPortfolioById(portfolioId, userId);
  } catch (error) {
    console.error("Error updating portfolio:", error);
    throw error;
  }
};

export const deletePortfolio = async (
  portfolioId: string,
  userId: string,
): Promise<boolean> => {
  const query = `
    DELETE FROM portfolios 
    WHERE id = ? AND user_id = ?
  `;

  try {
    const result = await client.execute({
      sql: query,
      args: [portfolioId, userId],
    });

    return result.rowsAffected > 0;
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    throw error;
  }
};
