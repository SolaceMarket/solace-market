import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle/client";
import {
  alpacaAccountsTable,
  alpacaContactsTable,
  alpacaIdentitiesTable,
  usersTable,
} from "@/database/drizzle/schemas";
import type { AccountWithRelations } from "@/types/alpaca";

/**
 * Fetch all Alpaca accounts from database with their related user, contact, and identity information
 */
export async function getAllAccountsWithRelations(): Promise<
  AccountWithRelations[]
> {
  const dbAccounts = await db
    .select({
      alpacaAccount: alpacaAccountsTable,
      user: usersTable,
      contact: alpacaContactsTable,
      identity: alpacaIdentitiesTable,
    })
    .from(alpacaAccountsTable)
    .leftJoin(usersTable, eq(alpacaAccountsTable.userId, usersTable.uid))
    .leftJoin(
      alpacaContactsTable,
      eq(alpacaAccountsTable.id, alpacaContactsTable.accountId),
    )
    .leftJoin(
      alpacaIdentitiesTable,
      eq(alpacaAccountsTable.id, alpacaIdentitiesTable.accountId),
    );

  return dbAccounts;
}

/**
 * Filter accounts to only include those with matching internal users
 */
export function filterAccountsWithUsers(
  accounts: AccountWithRelations[],
): AccountWithRelations[] {
  return accounts.filter(
    (account): account is AccountWithRelations => account.user !== null,
  );
}
