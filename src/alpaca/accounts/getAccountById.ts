import { headers } from "@/alpaca/config";
import type { AlpacaAccountDetailed } from "./Account";
import { accountUrl } from "./accountsConfig";
import { getAccounts } from "./getAccounts";

// Get all accounts with full details
export const getAllAccountsWithDetails = async (): Promise<
  AlpacaAccountDetailed[]
> => {
  console.log("Fetching all accounts with details...");

  const basicAccounts = await getAccounts();
  const detailedAccounts: AlpacaAccountDetailed[] = [];

  for (const basicAccount of basicAccounts) {
    const detailedAccount = await getAccountById(basicAccount.id);
    if (detailedAccount) {
      detailedAccounts.push(detailedAccount);
    }
  }

  return detailedAccounts;
};

// Get a specific account by ID from Alpaca Markets
export const getAccountById = async (
  accountId: string,
): Promise<AlpacaAccountDetailed | null> => {
  console.log("Fetching account with ID:", accountId);

  const url = accountUrl(accountId);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Account not found
      }
      throw new Error(`Failed to fetch account: ${response.status}`);
    }

    const accountData = (await response.json()) as AlpacaAccountDetailed;
    return accountData;
  } catch (error) {
    console.error("Error fetching account:", error);
    return null;
  }
};
