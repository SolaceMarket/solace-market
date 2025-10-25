import type { AlpacaAccount } from "./Account";
import { headers } from "@/alpaca/config";
import { getAccounts } from "./getAccounts";
import { accountUrl } from "./accountsConfig";

// Get a specific account by ID from Alpaca Markets
export const getAccountById = async (
  accountId: string,
): Promise<any | AlpacaAccount | null> => {
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

    const accountData = (await response.json()) as AlpacaAccount;
    return accountData;
  } catch (error) {
    console.error("Error fetching account:", error);
    return null;
  }
};
