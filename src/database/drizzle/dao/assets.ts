import { eq, like } from 'drizzle-orm';
import { db } from '../client';
import { assetsTable, type InsertAsset, type SelectAsset } from '../schemas/assets';

export class AssetsDAO {
  // Create a new asset
  static async create(asset: InsertAsset): Promise<SelectAsset> {
    const [insertedAsset] = await db.insert(assetsTable).values(asset).returning();
    return insertedAsset;
  }

  // Get asset by ID
  static async getById(id: string): Promise<SelectAsset | null> {
    const [asset] = await db.select().from(assetsTable).where(eq(assetsTable.id, id));
    return asset || null;
  }

  // Get asset by symbol
  static async getBySymbol(symbol: string): Promise<SelectAsset | null> {
    const [asset] = await db.select().from(assetsTable).where(eq(assetsTable.symbol, symbol));
    return asset || null;
  }

  // Get assets by exchange
  static async getByExchange(exchange: string): Promise<SelectAsset[]> {
    return await db.select().from(assetsTable).where(eq(assetsTable.exchange, exchange));
  }

  // Search assets by symbol or name
  static async search(query: string, limit = 20): Promise<SelectAsset[]> {
    const searchPattern = `%${query}%`;
    return await db
      .select()
      .from(assetsTable)
      .where(
        like(assetsTable.symbol, searchPattern) || 
        like(assetsTable.name, searchPattern)
      )
      .limit(limit);
  }

  // Get tradable assets
  static async getTradable(limit = 100, offset = 0): Promise<SelectAsset[]> {
    return await db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.tradable, true))
      .limit(limit)
      .offset(offset);
  }

  // Update asset
  static async update(id: string, updates: Partial<InsertAsset>): Promise<SelectAsset | null> {
    const [updatedAsset] = await db
      .update(assetsTable)
      .set(updates)
      .where(eq(assetsTable.id, id))
      .returning();
    return updatedAsset || null;
  }

  // Delete asset
  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(assetsTable).where(eq(assetsTable.id, id));
    return result.rowsAffected > 0;
  }

  // Get all assets
  static async getAll(limit = 100, offset = 0): Promise<SelectAsset[]> {
    return await db.select().from(assetsTable).limit(limit).offset(offset);
  }

  // Bulk insert assets
  static async bulkInsert(assets: InsertAsset[]): Promise<SelectAsset[]> {
    return await db.insert(assetsTable).values(assets).returning();
  }
}