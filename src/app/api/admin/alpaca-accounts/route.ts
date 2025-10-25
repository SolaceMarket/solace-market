import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/adminMiddleware";
import { db } from "@/database/drizzle/client";
import {
  alpacaAccountsTable,
  alpacaContactsTable,
  alpacaIdentitiesTable,
  alpacaDisclosuresTable,
  alpacaAgreementsTable,
  alpacaDocumentsTable,
  alpacaTrustedContactsTable,
  usersTable,
} from "@/database/drizzle/schemas";
import {
  getAllAccountsWithDetails,
  getAccountById,
} from "@/alpaca/accounts/getAccountById";
import { eq } from "drizzle-orm";
import type { AlpacaAccount } from "@/alpaca/accounts/Account";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

// Helper function to sync a single Alpaca account to database
async function syncAlpacaAccountToDb(account: AlpacaAccount, userId?: string) {
  const syncedAt = new Date().toISOString();

  // Upsert main account record
  await db
    .insert(alpacaAccountsTable)
    .values({
      id: account.id,
      userId: userId || null,
      accountNumber: account.account_number,
      status: account.status,
      cryptoStatus: account.crypto_status,
      kycSummary: account.kyc_results.summary,
      currency: account.currency,
      lastEquity: account.last_equity,
      createdAt: account.created_at,
      accountType: account.account_type,
      tradingType: account.trading_type,
      enabledAssets: JSON.stringify(account.enabled_assets),
      investmentObjective: account.investment_objective,
      investmentTimeHorizon: account.investment_time_horizon,
      riskTolerance: account.risk_tolerance,
      liquidityNeeds: account.liquidity_needs,
      syncedAt,
    })
    .onConflictDoUpdate({
      target: alpacaAccountsTable.id,
      set: {
        userId: userId || null,
        accountNumber: account.account_number,
        status: account.status,
        cryptoStatus: account.crypto_status,
        kycSummary: account.kyc_results.summary,
        currency: account.currency,
        lastEquity: account.last_equity,
        accountType: account.account_type,
        tradingType: account.trading_type,
        enabledAssets: JSON.stringify(account.enabled_assets),
        investmentObjective: account.investment_objective,
        investmentTimeHorizon: account.investment_time_horizon,
        riskTolerance: account.risk_tolerance,
        liquidityNeeds: account.liquidity_needs,
        syncedAt,
      },
    });

  // Upsert contact info
  await db
    .insert(alpacaContactsTable)
    .values({
      accountId: account.id,
      emailAddress: account.contact.email_address,
      phoneNumber: account.contact.phone_number,
      streetAddress: JSON.stringify(account.contact.street_address),
      localStreetAddress: account.contact.local_street_address,
      unit: account.contact.unit,
      city: account.contact.city,
      state: account.contact.state,
      postalCode: account.contact.postal_code,
      country: account.contact.country,
    })
    .onConflictDoUpdate({
      target: alpacaContactsTable.accountId,
      set: {
        emailAddress: account.contact.email_address,
        phoneNumber: account.contact.phone_number,
        streetAddress: JSON.stringify(account.contact.street_address),
        localStreetAddress: account.contact.local_street_address,
        unit: account.contact.unit,
        city: account.contact.city,
        state: account.contact.state,
        postalCode: account.contact.postal_code,
        country: account.contact.country,
      },
    });

  // Upsert identity info
  await db
    .insert(alpacaIdentitiesTable)
    .values({
      accountId: account.id,
      givenName: account.identity.given_name,
      familyName: account.identity.family_name,
      dateOfBirth: account.identity.date_of_birth,
      countryOfCitizenship: account.identity.country_of_citizenship,
      countryOfBirth: account.identity.country_of_birth,
      maritalStatus: account.identity.marital_status,
      numberOfDependents: account.identity.number_of_dependents,
      investmentExperienceStocks:
        account.identity.investment_experience_with_stocks,
      investmentExperienceOptions:
        account.identity.investment_experience_with_options,
      riskTolerance: account.identity.risk_tolerance,
      investmentObjective: account.identity.investment_objective,
      investmentTimeHorizon: account.identity.investment_time_horizon,
      liquidityNeeds: account.identity.liquidity_needs,
      partyType: account.identity.party_type,
      taxIdType: account.identity.tax_id_type,
      countryOfTaxResidence: account.identity.country_of_tax_residence,
      fundingSource: JSON.stringify(account.identity.funding_source),
      annualIncomeMin: account.identity.annual_income_min,
      annualIncomeMax: account.identity.annual_income_max,
      liquidNetWorthMin: account.identity.liquid_net_worth_min,
      liquidNetWorthMax: account.identity.liquid_net_worth_max,
      totalNetWorthMin: account.identity.total_net_worth_min,
      totalNetWorthMax: account.identity.total_net_worth_max,
    })
    .onConflictDoUpdate({
      target: alpacaIdentitiesTable.accountId,
      set: {
        givenName: account.identity.given_name,
        familyName: account.identity.family_name,
        dateOfBirth: account.identity.date_of_birth,
        countryOfCitizenship: account.identity.country_of_citizenship,
        countryOfBirth: account.identity.country_of_birth,
        maritalStatus: account.identity.marital_status,
        numberOfDependents: account.identity.number_of_dependents,
        investmentExperienceStocks:
          account.identity.investment_experience_with_stocks,
        investmentExperienceOptions:
          account.identity.investment_experience_with_options,
        riskTolerance: account.identity.risk_tolerance,
        investmentObjective: account.identity.investment_objective,
        investmentTimeHorizon: account.identity.investment_time_horizon,
        liquidityNeeds: account.identity.liquidity_needs,
        partyType: account.identity.party_type,
        taxIdType: account.identity.tax_id_type,
        countryOfTaxResidence: account.identity.country_of_tax_residence,
        fundingSource: JSON.stringify(account.identity.funding_source),
        annualIncomeMin: account.identity.annual_income_min,
        annualIncomeMax: account.identity.annual_income_max,
        liquidNetWorthMin: account.identity.liquid_net_worth_min,
        liquidNetWorthMax: account.identity.liquid_net_worth_max,
        totalNetWorthMin: account.identity.total_net_worth_min,
        totalNetWorthMax: account.identity.total_net_worth_max,
      },
    });

  // Upsert disclosures
  await db
    .insert(alpacaDisclosuresTable)
    .values({
      accountId: account.id,
      isControlPerson: account.disclosures.is_control_person,
      isAffiliatedExchangeOrFinra:
        account.disclosures.is_affiliated_exchange_or_finra,
      isAffiliatedExchangeOrIiroc:
        account.disclosures.is_affiliated_exchange_or_iiroc,
      isPoliticallyExposed: account.disclosures.is_politically_exposed,
      immediateFamilyExposed: account.disclosures.immediate_family_exposed,
      isDiscretionary: account.disclosures.is_discretionary,
    })
    .onConflictDoUpdate({
      target: alpacaDisclosuresTable.accountId,
      set: {
        isControlPerson: account.disclosures.is_control_person,
        isAffiliatedExchangeOrFinra:
          account.disclosures.is_affiliated_exchange_or_finra,
        isAffiliatedExchangeOrIiroc:
          account.disclosures.is_affiliated_exchange_or_iiroc,
        isPoliticallyExposed: account.disclosures.is_politically_exposed,
        immediateFamilyExposed: account.disclosures.immediate_family_exposed,
        isDiscretionary: account.disclosures.is_discretionary,
      },
    });

  // Clear and re-insert agreements
  await db
    .delete(alpacaAgreementsTable)
    .where(eq(alpacaAgreementsTable.accountId, account.id));
  for (const agreement of account.agreements) {
    await db.insert(alpacaAgreementsTable).values({
      id: `${account.id}-${agreement.agreement}-${agreement.signed_at}`,
      accountId: account.id,
      agreement: agreement.agreement,
      signedAt: agreement.signed_at,
      ipAddress: agreement.ip_address,
      revision: agreement.revision,
    });
  }

  // Clear and re-insert documents
  await db
    .delete(alpacaDocumentsTable)
    .where(eq(alpacaDocumentsTable.accountId, account.id));
  for (const document of account.documents) {
    await db.insert(alpacaDocumentsTable).values({
      id: document.id,
      accountId: account.id,
      documentType: document.document_type,
      documentSubType: document.document_sub_type,
      content: document.content,
      createdAt: document.created_at,
    });
  }

  // Upsert trusted contact
  if (account.trusted_contact) {
    await db
      .insert(alpacaTrustedContactsTable)
      .values({
        accountId: account.id,
        givenName: account.trusted_contact.given_name,
        familyName: account.trusted_contact.family_name,
        emailAddress: account.trusted_contact.email_address,
      })
      .onConflictDoUpdate({
        target: alpacaTrustedContactsTable.accountId,
        set: {
          givenName: account.trusted_contact.given_name,
          familyName: account.trusted_contact.family_name,
          emailAddress: account.trusted_contact.email_address,
        },
      })
      .catch((err) => {
        console.warn("Error upserting trusted contact:", err);
        // Continue execution - this is not critical
      });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await verifyAdminAccess(request);
    if (!authResult.isValid && authResult.error) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const includeOrphans = searchParams.get("includeOrphans") === "true";
    const syncFresh = searchParams.get("sync") === "true";

    type AccountWithRelations = {
      alpacaAccount: typeof alpacaAccountsTable.$inferSelect;
      user: typeof usersTable.$inferSelect | null;
      contact: typeof alpacaContactsTable.$inferSelect | null;
      identity: typeof alpacaIdentitiesTable.$inferSelect | null;
    };

    let accounts: AccountWithRelations[] = [];

    if (syncFresh) {
      // Fetch fresh data from Alpaca and sync to database
      console.log("Syncing fresh data from Alpaca Markets...");
      const alpacaAccounts = await getAllAccountsWithDetails();

      for (const alpacaAccount of alpacaAccounts) {
        // Try to find matching internal user by email
        const internalUsers = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, alpacaAccount.contact.email_address));

        const matchedUserId =
          internalUsers.length > 0 ? internalUsers[0].uid : undefined;

        // Sync to database
        await syncAlpacaAccountToDb(alpacaAccount, matchedUserId);
      }
    }

    // Fetch accounts from database with user info
    const dbAccounts = await db
      .select({
        alpacaAccount: alpacaAccountsTable,
        user: usersTable,
        contact: alpacaContactsTable,
        identity: alpacaIdentitiesTable,
      })
      .from(alpacaAccountsTable)
      .leftJoin(usersTable, eq(alpacaAccountsTable.userId, usersTable.uid))
      .leftJoin(
        alpacaContactsTable,
        eq(alpacaAccountsTable.id, alpacaContactsTable.accountId),
      )
      .leftJoin(
        alpacaIdentitiesTable,
        eq(alpacaAccountsTable.id, alpacaIdentitiesTable.accountId),
      );

    if (includeOrphans) {
      // Include accounts without matching internal users
      accounts = dbAccounts;
    } else {
      // Only include accounts with matching internal users
      accounts = dbAccounts.filter(
        (account): account is AccountWithRelations => account.user !== null,
      );
    }

    return NextResponse.json({
      success: true,
      accounts,
      total: accounts.length,
    });
  } catch (error) {
    console.error("Error in Alpaca accounts API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Link an Alpaca account to an internal user
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await verifyAdminAccess(request);
    if (!authResult.isValid && authResult.error) {
      return authResult.error;
    }

    const body = await request.json();
    const { alpacaAccountId, userId, action } = body;

    if (action === "link") {
      // Link Alpaca account to internal user
      await db
        .update(alpacaAccountsTable)
        .set({ userId })
        .where(eq(alpacaAccountsTable.id, alpacaAccountId));

      return NextResponse.json({
        success: true,
        message: "Account linked successfully",
      });
    }

    if (action === "unlink") {
      // Unlink Alpaca account from internal user
      await db
        .update(alpacaAccountsTable)
        .set({ userId: null })
        .where(eq(alpacaAccountsTable.id, alpacaAccountId));

      return NextResponse.json({
        success: true,
        message: "Account unlinked successfully",
      });
    }

    if (action === "syncSingle") {
      // Sync a single account from Alpaca
      const alpacaAccount = await getAccountById(alpacaAccountId);
      if (!alpacaAccount) {
        return NextResponse.json(
          { error: "Account not found in Alpaca Markets" },
          { status: 404 },
        );
      }

      await syncAlpacaAccountToDb(alpacaAccount, userId);

      return NextResponse.json({
        success: true,
        message: "Account synced successfully",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating Alpaca account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
