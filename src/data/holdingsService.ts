import { client } from "@/turso/database";
import { randomUUID } from "crypto";
import type {
  Holding,
  HoldingWithAsset,
  UpdateHoldingRequest,
} from "@/data/portfolioTypes";

export const getHoldingsByPortfolioId = async (
  portfolioId: string,
): Promise<HoldingWithAsset[]> => {
  const query = `
    SELECT 
      h.*,
      a.name as asset_name,
      a.class as asset_class,
      a.exchange as asset_exchange
    FROM holdings h
    JOIN assets a ON h.asset_id = a.id
    WHERE h.portfolio_id = ?
    ORDER BY h.market_value DESC
  `;

  try {
    const result = await client.execute({
      sql: query,
      args: [portfolioId],
    });

    return result.rows.map((row) => ({
      id: row.id as string,
      portfolio_id: row.portfolio_id as string,
      asset_id: row.asset_id as string,
      symbol: row.symbol as string,
      quantity: row.quantity as number,
      average_cost: row.average_cost as number,
      current_price: row.current_price as number,
      market_value: row.market_value as number,
      unrealized_pl: row.unrealized_pl as number,
      unrealized_pl_percent: row.unrealized_pl_percent as number,
      day_change_value: row.day_change_value as number,
      day_change_percent: row.day_change_percent as number,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      asset_name: row.asset_name as string,
      asset_class: row.asset_class as string,
      asset_exchange: row.asset_exchange as string,
    }));
  } catch (error) {
    console.error("Error fetching holdings:", error);
    throw error;
  }
};

export const getHoldingByAsset = async (
  portfolioId: string,
  assetId: string,
): Promise<Holding | null> => {
  const query = `
    SELECT * FROM holdings 
    WHERE portfolio_id = ? AND asset_id = ?
  `;

  try {
    const result = await client.execute({
      sql: query,
      args: [portfolioId, assetId],
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
      quantity: row.quantity as number,
      average_cost: row.average_cost as number,
      current_price: row.current_price as number,
      market_value: row.market_value as number,
      unrealized_pl: row.unrealized_pl as number,
      unrealized_pl_percent: row.unrealized_pl_percent as number,
      day_change_value: row.day_change_value as number,
      day_change_percent: row.day_change_percent as number,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  } catch (error) {
    console.error("Error fetching holding:", error);
    throw error;
  }
};

export const createOrUpdateHolding = async (
  portfolioId: string,
  assetId: string,
  symbol: string,
  quantity: number,
  price: number,
): Promise<Holding> => {
  const existingHolding = await getHoldingByAsset(portfolioId, assetId);

  if (existingHolding) {
    // Update existing holding with new average cost
    const newQuantity = existingHolding.quantity + quantity;
    const newAverageCost =
      newQuantity === 0
        ? 0
        : (existingHolding.average_cost * existingHolding.quantity +
            price * quantity) /
          newQuantity;

    return await updateHolding(existingHolding.id, {
      quantity: newQuantity,
      average_cost: newAverageCost,
    });
  } else {
    // Create new holding
    const holdingId = randomUUID();
    const now = new Date().toISOString();

    // Get current market price (mock for now)
    const currentPrice = price; // In real app, fetch from market data API
    const marketValue = quantity * currentPrice;
    const unrealizedPl = marketValue - quantity * price;
    const unrealizedPlPercent =
      price === 0 ? 0 : (unrealizedPl / (quantity * price)) * 100;

    const query = `
      INSERT INTO holdings (
        id, portfolio_id, asset_id, symbol, quantity, average_cost,
        current_price, market_value, unrealized_pl, unrealized_pl_percent,
        day_change_value, day_change_percent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await client.execute({
        sql: query,
        args: [
          holdingId,
          portfolioId,
          assetId,
          symbol,
          quantity,
          price,
          currentPrice,
          marketValue,
          unrealizedPl,
          unrealizedPlPercent,
          0,
          0,
          now,
          now,
        ],
      });

      const holding = await getHoldingByAsset(portfolioId, assetId);
      if (!holding) {
        throw new Error("Failed to create holding");
      }

      return holding;
    } catch (error) {
      console.error("Error creating holding:", error);
      throw error;
    }
  }
};

export const updateHolding = async (
  holdingId: string,
  updates: UpdateHoldingRequest,
): Promise<Holding> => {
  const now = new Date().toISOString();

  // Calculate derived values
  const currentPrice = updates.average_cost; // Mock current price
  const marketValue = updates.quantity * currentPrice;
  const costBasis = updates.quantity * updates.average_cost;
  const unrealizedPl = marketValue - costBasis;
  const unrealizedPlPercent =
    costBasis === 0 ? 0 : (unrealizedPl / costBasis) * 100;

  const query = `
    UPDATE holdings 
    SET quantity = ?, average_cost = ?, current_price = ?, 
        market_value = ?, unrealized_pl = ?, unrealized_pl_percent = ?,
        updated_at = ?
    WHERE id = ?
  `;

  try {
    await client.execute({
      sql: query,
      args: [
        updates.quantity,
        updates.average_cost,
        currentPrice,
        marketValue,
        unrealizedPl,
        unrealizedPlPercent,
        now,
        holdingId,
      ],
    });

    // Fetch and return updated holding
    const result = await client.execute({
      sql: "SELECT * FROM holdings WHERE id = ?",
      args: [holdingId],
    });

    if (result.rows.length === 0) {
      throw new Error("Holding not found after update");
    }

    const row = result.rows[0];
    return {
      id: row.id as string,
      portfolio_id: row.portfolio_id as string,
      asset_id: row.asset_id as string,
      symbol: row.symbol as string,
      quantity: row.quantity as number,
      average_cost: row.average_cost as number,
      current_price: row.current_price as number,
      market_value: row.market_value as number,
      unrealized_pl: row.unrealized_pl as number,
      unrealized_pl_percent: row.unrealized_pl_percent as number,
      day_change_value: row.day_change_value as number,
      day_change_percent: row.day_change_percent as number,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  } catch (error) {
    console.error("Error updating holding:", error);
    throw error;
  }
};

export const deleteHolding = async (holdingId: string): Promise<boolean> => {
  const query = "DELETE FROM holdings WHERE id = ?";

  try {
    const result = await client.execute({
      sql: query,
      args: [holdingId],
    });

    return result.rowsAffected > 0;
  } catch (error) {
    console.error("Error deleting holding:", error);
    throw error;
  }
};
