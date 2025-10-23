import { eq, and, desc } from 'drizzle-orm';
import { db } from '../client';
import { 
  portfoliosTable, 
  holdingsTable, 
  transactionsTable,
  type InsertPortfolio,
  type SelectPortfolio,
  type InsertHolding,
  type SelectHolding,
  type InsertTransaction,
  type SelectTransaction
} from '../schemas/portfolios';

export class PortfoliosDAO {
  // Create a new portfolio
  static async create(portfolio: InsertPortfolio): Promise<SelectPortfolio> {
    const [insertedPortfolio] = await db.insert(portfoliosTable).values(portfolio).returning();
    return insertedPortfolio;
  }

  // Get portfolio by ID
  static async getById(id: string): Promise<SelectPortfolio | null> {
    const [portfolio] = await db.select().from(portfoliosTable).where(eq(portfoliosTable.id, id));
    return portfolio || null;
  }

  // Get portfolios by user ID
  static async getByUserId(userId: string): Promise<SelectPortfolio[]> {
    return await db.select().from(portfoliosTable).where(eq(portfoliosTable.userId, userId));
  }

  // Update portfolio
  static async update(id: string, updates: Partial<InsertPortfolio>): Promise<SelectPortfolio | null> {
    const [updatedPortfolio] = await db
      .update(portfoliosTable)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(portfoliosTable.id, id))
      .returning();
    return updatedPortfolio || null;
  }

  // Delete portfolio
  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(portfoliosTable).where(eq(portfoliosTable.id, id));
    return result.rowsAffected > 0;
  }
}

export class HoldingsDAO {
  // Create a new holding
  static async create(holding: InsertHolding): Promise<SelectHolding> {
    const [insertedHolding] = await db.insert(holdingsTable).values(holding).returning();
    return insertedHolding;
  }

  // Get holding by ID
  static async getById(id: string): Promise<SelectHolding | null> {
    const [holding] = await db.select().from(holdingsTable).where(eq(holdingsTable.id, id));
    return holding || null;
  }

  // Get holdings by portfolio ID
  static async getByPortfolioId(portfolioId: string): Promise<SelectHolding[]> {
    return await db.select().from(holdingsTable).where(eq(holdingsTable.portfolioId, portfolioId));
  }

  // Get holding by portfolio and asset
  static async getByPortfolioAndAsset(portfolioId: string, assetId: string): Promise<SelectHolding | null> {
    const [holding] = await db
      .select()
      .from(holdingsTable)
      .where(and(eq(holdingsTable.portfolioId, portfolioId), eq(holdingsTable.assetId, assetId)));
    return holding || null;
  }

  // Update holding
  static async update(id: string, updates: Partial<InsertHolding>): Promise<SelectHolding | null> {
    const [updatedHolding] = await db
      .update(holdingsTable)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(holdingsTable.id, id))
      .returning();
    return updatedHolding || null;
  }

  // Delete holding
  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(holdingsTable).where(eq(holdingsTable.id, id));
    return result.rowsAffected > 0;
  }

  // Upsert holding (insert or update if exists)
  static async upsert(holding: InsertHolding): Promise<SelectHolding> {
    const existing = await this.getByPortfolioAndAsset(holding.portfolioId, holding.assetId);
    if (existing) {
      return await this.update(existing.id, holding) as SelectHolding;
    } else {
      return await this.create(holding);
    }
  }
}

export class TransactionsDAO {
  // Create a new transaction
  static async create(transaction: InsertTransaction): Promise<SelectTransaction> {
    const [insertedTransaction] = await db.insert(transactionsTable).values(transaction).returning();
    return insertedTransaction;
  }

  // Get transaction by ID
  static async getById(id: string): Promise<SelectTransaction | null> {
    const [transaction] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, id));
    return transaction || null;
  }

  // Get transactions by portfolio ID
  static async getByPortfolioId(portfolioId: string, limit = 100, offset = 0): Promise<SelectTransaction[]> {
    return await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.portfolioId, portfolioId))
      .orderBy(desc(transactionsTable.transactionDate))
      .limit(limit)
      .offset(offset);
  }

  // Get transactions by portfolio and asset
  static async getByPortfolioAndAsset(portfolioId: string, assetId: string): Promise<SelectTransaction[]> {
    return await db
      .select()
      .from(transactionsTable)
      .where(and(eq(transactionsTable.portfolioId, portfolioId), eq(transactionsTable.assetId, assetId)))
      .orderBy(desc(transactionsTable.transactionDate));
  }

  // Delete transaction
  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(transactionsTable).where(eq(transactionsTable.id, id));
    return result.rowsAffected > 0;
  }

  // Bulk insert transactions
  static async bulkInsert(transactions: InsertTransaction[]): Promise<SelectTransaction[]> {
    return await db.insert(transactionsTable).values(transactions).returning();
  }
}