/**
 * Onboarding types index
 *
 * This file provides centralized exports for all onboarding types.
 * Import from this file to maintain clean and consistent imports.
 */

// === BASE TYPES ===
export type {
  OnboardingStep,
  ExperienceLevel,
  KYCStatus,
  BrokerStatus,
  TwoFAMethod,
  Theme,
  DefaultQuote,
  Locale,
  Jurisdiction,
  BlockchainType,
  KYCProvider,
  BrokerProvider,
  DocumentType,
  DocumentStatus,
} from "./base";

// === USER TYPES ===
export type {
  ConsentInfo,
  UserConsents,
  UserProfile,
  KYCDocument,
  KYCData,
  UserKYC,
  UserWallet,
  UserBroker,
  UserSecurity,
  UserPreferences,
  OnboardingState,
  User,
  StepProgress,
  OnboardingEvent,
} from "./user";

// === API TYPES ===
export type {
  // Initialization
  InitOnboardingRequest,
  InitOnboardingResponse,
  // Consents
  ConsentRequest,
  ConsentResponse,
  // Profile
  ProfileRequest,
  ProfileResponse,
  // KYC
  KYCStartRequest,
  KYCStartResponse,
  KYCStatusRequest,
  KYCStatusResponse,
  KYCSaveRequest,
  KYCSaveResponse,
  // Wallet
  WalletLinkRequest,
  WalletLinkResponse,
  // Broker
  BrokerSubaccountRequest,
  BrokerSubaccountResponse,
  // Security
  SecuritySetupRequest,
  SecuritySetupResponse,
  // Preferences
  PreferencesRequest,
  PreferencesResponse,
  // Step Management
  UpdateStepRequest,
  UpdateStepResponse,
} from "./api";

// === CONFIGURATION ===
export type { LegalDocumentVersions } from "./config";
export { ONBOARDING_CONFIG, OnboardingError } from "./config";

// === DEPRECATED - For backward compatibility ===
// Re-export the main onboarding.ts types for existing imports
// TODO: Remove these after migrating all imports to use the new structure

export type { OnboardingStep as OnboardingStepDeprecated } from "./base";

export type {
  User as UserDeprecated,
  UserProfile as UserProfileDeprecated,
  UserPreferences as UserPreferencesDeprecated,
  KYCData as KYCDataDeprecated,
} from "./user";
