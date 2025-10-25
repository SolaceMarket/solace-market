import { eq } from "drizzle-orm";
import { getAccountById } from "@/alpaca/accounts/getAccountById";
import { db } from "@/database/drizzle/client";
import { alpacaAccountsTable, usersTable } from "@/database/drizzle/schemas";
import { syncAlpacaAccountToDb } from "./accountSync";

/**
 * Link an Alpaca account to an internal user
 */
export async function linkAlpacaAccount(
  alpacaAccountId: string,
  userId: string,
) {
  await db
    .update(alpacaAccountsTable)
    .set({ userId })
    .where(eq(alpacaAccountsTable.id, alpacaAccountId));
}

/**
 * Unlink an Alpaca account from an internal user
 */
export async function unlinkAlpacaAccount(alpacaAccountId: string) {
  await db
    .update(alpacaAccountsTable)
    .set({ userId: null })
    .where(eq(alpacaAccountsTable.id, alpacaAccountId));
}

/**
 * Sync a single Alpaca account from the API to the database
 */
export async function syncSingleAlpacaAccount(
  alpacaAccountId: string,
  userId?: string,
) {
  const alpacaAccount = await getAccountById(alpacaAccountId);
  if (!alpacaAccount) {
    throw new Error("Account not found in Alpaca Markets");
  }

  await syncAlpacaAccountToDb(alpacaAccount, userId);
  return alpacaAccount;
}

/**
 * Find internal user by email address
 */
export async function findUserByEmail(email: string) {
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return users.length > 0 ? users[0] : null;
}
