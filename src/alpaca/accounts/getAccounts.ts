import fs from "node:fs";
import type { Account } from "@/alpaca/accounts/Account";
import { accountsUrl } from "@/alpaca/accounts/accountsConfig";
import { headers } from "@/alpaca/config";

export const getAccounts = async () => {
  const accountsResponse = await fetch(accountsUrl, {
    method: "GET",
    headers,
  });
  const accountsData = (await accountsResponse.json()) as Account[];
  //   console.log("accounts data as json", accountsData);
  const accountsCount = accountsData.length;
  console.log("Total accounts count:", accountsCount);

  fs.writeFileSync(
    "accounts.json",
    JSON.stringify(accountsData, null, 2),
    "utf-8",
  );
};
