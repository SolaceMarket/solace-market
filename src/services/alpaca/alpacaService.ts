import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle/client";
import { alpacaAccountsTable } from "@/database/drizzle/schemas/accounts";

/**
 * Check if an Alpaca account already exists in the database
 */
export async function alpacaAccountExists(accountId: string): Promise<boolean> {
  try {
    const result = await db
      .select({ id: alpacaAccountsTable.id })
      .from(alpacaAccountsTable)
      .where(eq(alpacaAccountsTable.id, accountId))
      .limit(1);
    return result.length > 0;
  } catch (error) {
    console.error(`Error checking if account ${accountId} exists:`, error);
    return false;
  }
}
