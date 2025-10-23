import type { Account } from "@/alpaca/accounts/Account";
import { accountsUrl } from "@/alpaca/accounts/accountsConfig";
import { headers } from "@/alpaca/config";

export const createAccount = async (account: Omit<Account, "id">) => {
  const accountResponse = await fetch(accountsUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(account),
  });

  const accountData = await accountResponse.json();
  console.log("accounts data as json", accountData);

  const accountsCount = accountData.length;
  console.log("Total accounts count:", accountsCount);
};
