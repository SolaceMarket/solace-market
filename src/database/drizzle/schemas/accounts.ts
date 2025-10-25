import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { usersTable } from "./users";

// Internal account balances (existing functionality)
export const accountsTable = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => usersTable.uid),
  assetId: text("asset_id").notNull(),
  balance: real("balance").notNull().default(0),
  available: real("available").notNull().default(0),
  locked: real("locked").notNull().default(0),
});

// Alpaca Markets accounts
export const alpacaAccountsTable = sqliteTable("alpaca_accounts", {
  id: text("id").primaryKey(), // Alpaca account ID
  userId: text("user_id").references(() => usersTable.uid), // Link to internal user (nullable for orphans)
  accountNumber: text("account_number").notNull(),
  status: text("status").notNull(),
  cryptoStatus: text("crypto_status"),
  kycSummary: text("kyc_summary"),
  currency: text("currency").notNull(),
  lastEquity: text("last_equity"),
  createdAt: text("created_at").notNull(),
  accountType: text("account_type"),
  tradingType: text("trading_type"),
  enabledAssets: text("enabled_assets"), // JSON array
  investmentObjective: text("investment_objective"),
  investmentTimeHorizon: text("investment_time_horizon"),
  riskTolerance: text("risk_tolerance"),
  liquidityNeeds: text("liquidity_needs"),
  syncedAt: text("synced_at").notNull(), // When we last synced this data
});

// Alpaca account contacts
export const alpacaContactsTable = sqliteTable("alpaca_contacts", {
  accountId: text("account_id")
    .primaryKey()
    .references(() => alpacaAccountsTable.id),
  emailAddress: text("email_address").notNull(),
  phoneNumber: text("phone_number"),
  streetAddress: text("street_address"), // JSON array
  localStreetAddress: text("local_street_address"),
  unit: text("unit"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),
});

// Alpaca account identity information
export const alpacaIdentitiesTable = sqliteTable("alpaca_identities", {
  accountId: text("account_id")
    .primaryKey()
    .references(() => alpacaAccountsTable.id),
  givenName: text("given_name").notNull(),
  familyName: text("family_name").notNull(),
  dateOfBirth: text("date_of_birth"),
  countryOfCitizenship: text("country_of_citizenship"),
  countryOfBirth: text("country_of_birth"),
  maritalStatus: text("marital_status"),
  numberOfDependents: integer("number_of_dependents"),
  investmentExperienceStocks: text("investment_experience_stocks"),
  investmentExperienceOptions: text("investment_experience_options"),
  riskTolerance: text("risk_tolerance"),
  investmentObjective: text("investment_objective"),
  investmentTimeHorizon: text("investment_time_horizon"),
  liquidityNeeds: text("liquidity_needs"),
  partyType: text("party_type"),
  taxIdType: text("tax_id_type"),
  countryOfTaxResidence: text("country_of_tax_residence"),
  fundingSource: text("funding_source"), // JSON array
  annualIncomeMin: text("annual_income_min"),
  annualIncomeMax: text("annual_income_max"),
  liquidNetWorthMin: text("liquid_net_worth_min"),
  liquidNetWorthMax: text("liquid_net_worth_max"),
  totalNetWorthMin: text("total_net_worth_min"),
  totalNetWorthMax: text("total_net_worth_max"),
});

// Alpaca account disclosures
export const alpacaDisclosuresTable = sqliteTable("alpaca_disclosures", {
  accountId: text("account_id")
    .primaryKey()
    .references(() => alpacaAccountsTable.id),
  isControlPerson: integer("is_control_person", { mode: "boolean" }),
  isAffiliatedExchangeOrFinra: integer("is_affiliated_exchange_or_finra", {
    mode: "boolean",
  }),
  isAffiliatedExchangeOrIiroc: integer("is_affiliated_exchange_or_iiroc", {
    mode: "boolean",
  }),
  isPoliticallyExposed: integer("is_politically_exposed", { mode: "boolean" }),
  immediateFamilyExposed: integer("immediate_family_exposed", {
    mode: "boolean",
  }),
  isDiscretionary: integer("is_discretionary", { mode: "boolean" }),
});

// Alpaca account agreements
export const alpacaAgreementsTable = sqliteTable("alpaca_agreements", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => alpacaAccountsTable.id),
  agreement: text("agreement").notNull(),
  signedAt: text("signed_at").notNull(),
  ipAddress: text("ip_address"),
  revision: text("revision"),
});

// Alpaca account documents
export const alpacaDocumentsTable = sqliteTable("alpaca_documents", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => alpacaAccountsTable.id),
  documentType: text("document_type").notNull(),
  documentSubType: text("document_sub_type"),
  content: text("content"), // URL to document
  createdAt: text("created_at"),
});

// Alpaca trusted contacts
export const alpacaTrustedContactsTable = sqliteTable(
  "alpaca_trusted_contacts",
  {
    accountId: text("account_id")
      .primaryKey()
      .references(() => alpacaAccountsTable.id),
    givenName: text("given_name"),
    familyName: text("family_name"),
    emailAddress: text("email_address"),
  },
);

// TypeScript types
export type InsertAccount = typeof accountsTable.$inferInsert;
export type SelectAccount = typeof accountsTable.$inferSelect;

export type InsertAlpacaAccount = typeof alpacaAccountsTable.$inferInsert;
export type SelectAlpacaAccount = typeof alpacaAccountsTable.$inferSelect;

export type InsertAlpacaContact = typeof alpacaContactsTable.$inferInsert;
export type SelectAlpacaContact = typeof alpacaContactsTable.$inferSelect;

export type InsertAlpacaIdentity = typeof alpacaIdentitiesTable.$inferInsert;
export type SelectAlpacaIdentity = typeof alpacaIdentitiesTable.$inferSelect;

export type InsertAlpacaDisclosure = typeof alpacaDisclosuresTable.$inferInsert;
export type SelectAlpacaDisclosure = typeof alpacaDisclosuresTable.$inferSelect;

export type InsertAlpacaAgreement = typeof alpacaAgreementsTable.$inferInsert;
export type SelectAlpacaAgreement = typeof alpacaAgreementsTable.$inferSelect;

export type InsertAlpacaDocument = typeof alpacaDocumentsTable.$inferInsert;
export type SelectAlpacaDocument = typeof alpacaDocumentsTable.$inferSelect;

export type InsertAlpacaTrustedContact =
  typeof alpacaTrustedContactsTable.$inferInsert;
export type SelectAlpacaTrustedContact =
  typeof alpacaTrustedContactsTable.$inferSelect;
