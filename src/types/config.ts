/**
 * Onboarding configuration and constants
 *
 * This file contains configuration values, constants, and utility types.
 */

import type { OnboardingStep } from "./base";

// Legal document versions (these would be environment variables in practice)
export interface LegalDocumentVersions {
  tosVersion: string;
  privacyVersion: string;
  riskVersion: string;
}

// Configuration constants
export const ONBOARDING_CONFIG = {
  BRAND_NAME: "Solace.Market",
  PRIMARY_LOCALE: "de-DE" as const,
  KYC_PROVIDER: "MockKYC" as const,
  BROKER_PROVIDER: "MockBroker" as const,
  LEGAL_VERSIONS: {
    tosVersion: "2025.1.0",
    privacyVersion: "2025.1.0",
    riskVersion: "2025.1.0",
  } as LegalDocumentVersions,
  ANALYTICS_EVENTS: {
    ONBOARDING_STARTED: "onboarding_started",
    CONSENT_ACCEPTED: "consent_accepted",
    PROFILE_SAVED: "profile_saved",
    KYC_SUBMITTED: "kyc_submitted",
    WALLET_LINKED: "wallet_linked",
    BROKER_SUBACCOUNT_CREATED: "broker_subaccount_created",
    TWO_FA_ENABLED: "2fa_enabled",
    PREFERENCES_SAVED: "preferences_saved",
    ONBOARDING_COMPLETED: "onboarding_completed",
    TOUR_STARTED: "tour_started",
    TOUR_COMPLETED: "tour_completed",
    STEP_STARTED: "step_started",
    STEP_COMPLETED: "step_completed",
  },
} as const;

// Error types
export class OnboardingError extends Error {
  constructor(
    message: string,
    public code: string,
    public step?: OnboardingStep,
    public retryable: boolean = false,
  ) {
    super(message);
    this.name = "OnboardingError";
  }
}
