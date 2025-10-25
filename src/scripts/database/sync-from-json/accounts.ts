import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type {
  AlpacaAccount,
  AlpacaAccountDetailed,
} from "@/alpaca/accounts/Account";
import { db } from "@/database/drizzle/client";
import { alpacaAccountsTable } from "@/database/drizzle/schemas/accounts";
import { syncAlpacaAccountToDb } from "@/services/alpaca/accountSync";
import { alpacaAccountExists } from "@/services/alpaca/alpacaService";

// Import Alpaca accounts from JSON files
export async function importAlpacaAccountsFromJson() {
  console.log("Starting Alpaca accounts import from JSON files...");

  try {
    const accountsDirPath = join(process.cwd(), "data", "accounts");

    // Check if accounts directory exists
    if (!existsSync(accountsDirPath)) {
      console.log("No accounts directory found, skipping account import");
      return;
    }

    // Read accounts.json for basic account list
    const accountsFilePath = join(accountsDirPath, "accounts.json");
    if (!existsSync(accountsFilePath)) {
      console.log("No accounts.json found, skipping account import");
      return;
    }

    const accountsJsonContent = readFileSync(accountsFilePath, "utf-8");
    const basicAccounts: AlpacaAccount[] = JSON.parse(accountsJsonContent);

    console.log(`Found ${basicAccounts.length} accounts in accounts.json`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const basicAccount of basicAccounts) {
      try {
        // Check if account already exists
        const exists = await alpacaAccountExists(basicAccount.id);
        if (exists) {
          console.log(
            `⏭️  Skipping existing account: ${basicAccount.account_number} (${basicAccount.id})`,
          );
          skippedCount++;
          continue;
        }

        // Try to load detailed account data
        const detailedAccountPath = join(
          accountsDirPath,
          `account_${basicAccount.id}.json`,
        );

        if (existsSync(detailedAccountPath)) {
          // Import detailed account
          const detailedAccountContent = readFileSync(
            detailedAccountPath,
            "utf-8",
          );
          const detailedAccount: AlpacaAccountDetailed = JSON.parse(
            detailedAccountContent,
          );

          await syncAlpacaAccountToDb(detailedAccount);
          console.log(
            `✅ Imported detailed account: ${detailedAccount.account_number}`,
          );
        } else {
          // Import basic account only (insert into main alpaca_accounts table)
          const syncedAt = new Date().toISOString();
          await db.insert(alpacaAccountsTable).values({
            id: basicAccount.id,
            userId: null,
            accountNumber: basicAccount.account_number,
            status: basicAccount.status,
            cryptoStatus: basicAccount.crypto_status,
            kycSummary: basicAccount.kyc_results.summary,
            currency: basicAccount.currency,
            lastEquity: basicAccount.last_equity,
            createdAt: basicAccount.created_at,
            accountType: basicAccount.account_type,
            tradingType: basicAccount.trading_type,
            enabledAssets: JSON.stringify(basicAccount.enabled_assets),
            investmentObjective: basicAccount.investment_objective,
            investmentTimeHorizon: basicAccount.investment_time_horizon,
            riskTolerance: basicAccount.risk_tolerance,
            liquidityNeeds: basicAccount.liquidity_needs,
            syncedAt,
          });
          console.log(
            `✅ Imported basic account: ${basicAccount.account_number}`,
          );
        }

        successCount++;
      } catch (error) {
        console.error(
          `Error processing account ${basicAccount.account_number}:`,
          error,
        );
        errorCount++;
      }
    }

    console.log(`\nAlpaca accounts import completed:`);
    console.log(`✅ Successfully imported: ${successCount} accounts`);
    console.log(`⏭️  Skipped existing: ${skippedCount} accounts`);
    console.log(`❌ Failed to import: ${errorCount} accounts`);
    console.log(
      `📊 Total processed: ${successCount + skippedCount + errorCount} accounts`,
    );
  } catch (error) {
    console.error("Error reading or parsing account JSON files:", error);
    throw error;
  }
}
