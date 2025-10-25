import fs from "node:fs";
import { join } from "node:path";
import type { AlpacaAccount } from "@/alpaca/accounts/Account";
import { getAccountById } from "@/alpaca/accounts/getAccountById";
import { getAccounts } from "@/alpaca/accounts/getAccounts";
import { getAssets } from "@/alpaca/assets/getAssets";

const basePath = join(process.cwd(), "data");
const assetsDirPath = join(basePath, "assets");
const assetsFilePath = join(assetsDirPath, "assets.json");
const accountsDirPath = join(basePath, "accounts");
const accountsFilePath = join(accountsDirPath, "accounts.json");
const accountFilePath = (accountId: string) =>
  join(accountsDirPath, `account_${accountId}.json`);

// export const retrieveAndSaveToJson = async (
//   retrieveFunction: () => Promise<any[]>,
//   fileName: string,
// ) => {
//   const data = await retrieveFunction();

//   const filePath = `${basePath}/${fileName}`;
//   console.log(`Saving data to ${filePath}`);

//   fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
// };

export const saveAssetsToJson = async () => {
  if (!fs.existsSync(assetsDirPath)) {
    fs.mkdirSync(assetsDirPath, { recursive: true });
  }

  const assets = await getAssets();

  const assetsCount = assets.length;
  console.log("Total assets count:", assetsCount);

  console.log("Saving assets to", assetsFilePath);
  fs.writeFileSync(assetsFilePath, JSON.stringify(assets, null, 2), "utf-8");
  console.log("Assets saved successfully.");

  return assets;
};

export const saveAccountsToJson = async () => {
  if (!fs.existsSync(accountsDirPath)) {
    fs.mkdirSync(accountsDirPath, { recursive: true });
  }

  const accounts = await getAccounts();

  const accountsCount = accounts.length;
  console.log("Total accounts count:", accountsCount);

  console.log("Saving accounts to", accountsFilePath);
  fs.writeFileSync(
    accountsFilePath,
    JSON.stringify(accounts, null, 2),
    "utf-8",
  );
  console.log("Accounts saved successfully.");

  return accounts;
};

export const saveDetailedAccountsToJson = async (accounts: AlpacaAccount[]) => {
  for (const account of accounts) {
    const detailedAccount = await getAccountById(account.id);

    const filePath = accountFilePath(account.id);
    fs.writeFileSync(
      filePath,
      JSON.stringify(detailedAccount, null, 2),
      "utf-8",
    );
  }
};

export const syncToJson = async () => {
  await saveAssetsToJson();

  const accounts = await saveAccountsToJson();
  await saveDetailedAccountsToJson(accounts);
};

await syncToJson();
