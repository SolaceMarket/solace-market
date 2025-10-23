import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Users table with comprehensive fields matching existing Turso schema
export const usersTable = sqliteTable('users', {
  // Primary identification
  uid: text('uid').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: text('created_at').notNull(),
  locale: text('locale').notNull().default('de'),
  jurisdiction: text('jurisdiction').notNull().default('EU'),
  
  // Onboarding state
  onboardingStartedAt: text('onboarding_started_at').notNull(),
  onboardingCurrentStep: text('onboarding_current_step').notNull().default('welcome'),
  onboardingCompletedSteps: text('onboarding_completed_steps').notNull().default('[]'), // JSON array
  onboardingCompleted: integer('onboarding_completed', { mode: 'boolean' }).notNull().default(false),
  onboardingCompletedAt: text('onboarding_completed_at'),
  onboardingLastActivityAt: text('onboarding_last_activity_at').notNull(),
  
  // Legal consents
  consentsTosVersion: text('consents_tos_version'),
  consentsTosAcceptedAt: text('consents_tos_accepted_at'),
  consentsPrivacyVersion: text('consents_privacy_version'),
  consentsPrivacyAcceptedAt: text('consents_privacy_accepted_at'),
  consentsRiskVersion: text('consents_risk_version'),
  consentsRiskAcceptedAt: text('consents_risk_accepted_at'),
  
  // Profile
  profileFirstName: text('profile_first_name'),
  profileLastName: text('profile_last_name'),
  profileDob: text('profile_dob'),
  profileCountry: text('profile_country'),
  profileTaxResidency: text('profile_tax_residency'),
  profileAddress: text('profile_address'),
  profilePhone: text('profile_phone'),
  profileExperience: text('profile_experience'),
  
  // KYC
  kycProvider: text('kyc_provider'),
  kycStatus: text('kyc_status'),
  kycLastCheckedAt: text('kyc_last_checked_at'),
  kycSubmittedAt: text('kyc_submitted_at'),
  kycApprovedAt: text('kyc_approved_at'),
  kycRejectedAt: text('kyc_rejected_at'),
  kycRejectionReason: text('kyc_rejection_reason'),
  
  // Wallet
  walletChain: text('wallet_chain'),
  walletPublicKey: text('wallet_public_key'),
  walletVerifiedAt: text('wallet_verified_at'),
  walletIsGenerated: integer('wallet_is_generated', { mode: 'boolean' }).default(false),
  
  // Broker
  brokerProvider: text('broker_provider'),
  brokerSubAccountId: text('broker_sub_account_id'),
  brokerStatus: text('broker_status'),
  brokerCreatedAt: text('broker_created_at'),
  brokerLastSyncAt: text('broker_last_sync_at'),
  
  // Security
  security2faMethod: text('security_2fa_method'),
  security2faEnabled: integer('security_2fa_enabled', { mode: 'boolean' }).default(false),
  security2faEnabledAt: text('security_2fa_enabled_at'),
  
  // Preferences
  preferencesNews: integer('preferences_news', { mode: 'boolean' }).default(true),
  preferencesOrderFills: integer('preferences_order_fills', { mode: 'boolean' }).default(true),
  preferencesRiskAlerts: integer('preferences_risk_alerts', { mode: 'boolean' }).default(true),
  preferencesStatements: integer('preferences_statements', { mode: 'boolean' }).default(true),
  preferencesTheme: text('preferences_theme').default('dark'),
  preferencesDefaultQuote: text('preferences_default_quote').default('USDC'),
  preferencesHintsEnabled: integer('preferences_hints_enabled', { mode: 'boolean' }).default(true),
  
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;