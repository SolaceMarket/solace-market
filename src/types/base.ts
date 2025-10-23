/**
 * Base onboarding types and enums
 *
 * This file contains the fundamental types used throughout the onboarding system.
 */

// Core onboarding step type
export type OnboardingStep =
  | "welcome"
  | "consents"
  | "profile"
  | "kyc"
  | "wallet"
  | "broker"
  | "security"
  | "preferences"
  | "tour"
  | "done";

// Experience levels for trading
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

// KYC status types
export type KYCStatus = 
  | "not_started" 
  | "pending" 
  | "under_review" 
  | "requires_more" 
  | "approved" 
  | "rejected" 
  | "expired" 
  | "flagged";

// KYC verification level
export type KYCLevel = "basic" | "enhanced" | "premium";

// KYC risk assessment
export type KYCRiskLevel = "low" | "medium" | "high" | "critical";

// Brokerage account status
export type BrokerStatus = "active" | "pending_review" | "error";

// 2FA methods
export type TwoFAMethod = "webauthn" | "totp";

// Theme preference
export type Theme = "dark" | "light";

// Default quote assets
export type DefaultQuote = "USDC" | "EUR" | "USD";

// Supported locales
export type Locale = "en" | "de";

// Jurisdiction types
export type Jurisdiction = "EU" | "DE" | "US" | "Other";

// Blockchain types
export type BlockchainType = "solana";

// Provider types
export type KYCProvider = 
  | "mock" 
  | "jumio" 
  | "onfido" 
  | "persona" 
  | "veriff" 
  | "sumsub" 
  | "shufti_pro" 
  | "trulioo" 
  | "au10tix";
export type BrokerProvider = "mock";

// KYC document types
export type DocumentType = 
  | "identity" 
  | "address" 
  | "selfie" 
  | "passport" 
  | "drivers_license" 
  | "national_id" 
  | "utility_bill" 
  | "bank_statement" 
  | "proof_of_income";

// KYC document status
export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "approved"
  | "rejected"
  | "failed"
  | "expired"
  | "corrupted";
