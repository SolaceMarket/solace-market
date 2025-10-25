import type { AlpacaAccount } from "./Account";
import { headers } from "@/alpaca/config";

// Get a specific account by ID from Alpaca Markets
export const getAccountById = async (
  accountId: string,
): Promise<AlpacaAccount | null> => {
  try {
    const response = await fetch(
      `${process.env.ALPACA_PAPER_BASE_URL}/v1/accounts/${accountId}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Account not found
      }
      throw new Error(`Failed to fetch account: ${response.status}`);
    }

    const accountData = (await response.json()) as AlpacaAccount;
    return accountData;
  } catch (error) {
    console.error("Error fetching account:", error);
    return null;
  }
};

// Get all accounts and then fetch detailed info for each
export const getAllAccountsWithDetails = async (): Promise<AlpacaAccount[]> => {
  try {
    // First get the list of accounts
    const accountsResponse = await fetch(
      `${process.env.ALPACA_PAPER_BASE_URL}/v1/accounts`,
      {
        method: "GET",
        headers,
      },
    );

    if (!accountsResponse.ok) {
      throw new Error(
        `Failed to fetch accounts list: ${accountsResponse.status}`,
      );
    }

    const basicAccounts = (await accountsResponse.json()) as Array<{
      id: string;
    }>;

    // Then fetch detailed info for each account
    const detailedAccounts: AlpacaAccount[] = [];

    for (const basicAccount of basicAccounts) {
      const detailedAccount = await getAccountById(basicAccount.id);
      if (detailedAccount) {
        detailedAccounts.push(detailedAccount);
      }
    }

    return detailedAccounts;
  } catch (error) {
    console.error("Error fetching all accounts with details:", error);
    return [];
  }
};
