import { eq } from "drizzle-orm";
import type { AlpacaAccountDetailed } from "@/alpaca/accounts/Account";
import { db } from "@/database/drizzle/client";
import {
  alpacaAccountsTable,
  alpacaAgreementsTable,
  alpacaContactsTable,
  alpacaDisclosuresTable,
  alpacaDocumentsTable,
  alpacaIdentitiesTable,
  alpacaTrustedContactsTable,
} from "@/database/drizzle/schemas";

/**
 * Sync a single Alpaca account to the database
 * This function handles upserting all related account data including
 * contacts, identity, disclosures, agreements, documents, and trusted contacts
 */
export async function syncAlpacaAccountToDb(
  account: AlpacaAccountDetailed,
  userId?: string,
) {
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
