import type { Account } from "@/alpaca/accounts/Account";
import { client } from "@/turso/database";

export const insertAccount = async (account: Account) => {
  try {
    const result = await client.execute(
      `INSERT INTO accounts (
        contact,
        identity,
        disclosures,
        agreements,
        documents,
        trusted_contact,
        enabled_assets
    ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [...Object.values(account)],
    );
    console.log("Inserted account", result);
    return result;
  } catch (error) {
    console.error("Error inserting account", error);
    return { error: (error as Error).message };
  }
};
