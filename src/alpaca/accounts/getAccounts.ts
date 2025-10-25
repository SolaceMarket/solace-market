import type { AlpacaAccount } from "@/alpaca/accounts/Account";
import { accountsUrl } from "@/alpaca/accounts/accountsConfig";
import { headers } from "@/alpaca/config";

export const getAccounts = async (): Promise<AlpacaAccount[]> => {
  const accountsResponse = await fetch(accountsUrl, {
    method: "GET",
    headers,
  });
  const accountsData = (await accountsResponse.json()) as AlpacaAccount[];
  return accountsData;
};
