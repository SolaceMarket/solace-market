import type { Account } from "@/alpaca/accounts/Account";
import { accountsUrl } from "@/alpaca/accounts/accountsConfig";
import { headers } from "@/alpaca/config";

export const getAccounts = async () => {
  const accountsResponse = await fetch(accountsUrl, {
    method: "GET",
    headers,
  });
  const accountsData = (await accountsResponse.json()) as Account[];
  return accountsData;
};
