import { eq, and } from 'drizzle-orm';
import { db } from '../client';
import { accountsTable, type InsertAccount, type SelectAccount } from '../schemas/accounts';

export class AccountsDAO {
  // Create a new account
  static async create(account: InsertAccount): Promise<SelectAccount> {
    const [insertedAccount] = await db.insert(accountsTable).values(account).returning();
    return insertedAccount;
  }

  // Get account by ID
  static async getById(id: string): Promise<SelectAccount | null> {
    const [account] = await db.select().from(accountsTable).where(eq(accountsTable.id, id));
    return account || null;
  }

  // Get accounts by user ID
  static async getByUserId(userId: string): Promise<SelectAccount[]> {
    return await db.select().from(accountsTable).where(eq(accountsTable.userId, userId));
  }

  // Get account by user and asset
  static async getByUserAndAsset(userId: string, assetId: string): Promise<SelectAccount | null> {
    const [account] = await db
      .select()
      .from(accountsTable)
      .where(and(eq(accountsTable.userId, userId), eq(accountsTable.assetId, assetId)));
    return account || null;
  }

  // Update account balance
  static async updateBalance(
    id: string, 
    updates: {
      balance?: number;
      available?: number;
      locked?: number;
    }
  ): Promise<SelectAccount | null> {
    const [updatedAccount] = await db
      .update(accountsTable)
      .set(updates)
      .where(eq(accountsTable.id, id))
      .returning();
    return updatedAccount || null;
  }

  // Delete account
  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(accountsTable).where(eq(accountsTable.id, id));
    return result.rowsAffected > 0;
  }

  // Get all accounts (for admin)
  static async getAll(limit = 50, offset = 0): Promise<SelectAccount[]> {
    return await db.select().from(accountsTable).limit(limit).offset(offset);
  }
}