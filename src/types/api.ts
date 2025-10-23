/**
 * API request and response types
 *
 * This file contains all interfaces for API communication.
 */

import type {
  OnboardingStep,
  KYCStatus,
  TwoFAMethod,
  Locale,
  Jurisdiction,
} from "./base";
import type {
  User,
  UserConsents,
  UserProfile,
  UserWallet,
  UserBroker,
  UserSecurity,
  UserPreferences,
  KYCData,
} from "./user";

// === INITIALIZATION ===

export interface InitOnboardingRequest {
  uid: string;
  email: string;
  locale?: Locale;
}

export interface InitOnboardingResponse {
  success: boolean;
  user: User;
}

// === CONSENTS ===

export interface ConsentRequest {
  uid: string;
  consents: {
    tos: boolean;
    privacy: boolean;
    risk: boolean;
  };
}

export interface ConsentResponse {
  success: boolean;
  consents: UserConsents;
}

// === PROFILE ===

export interface ProfileRequest {
  uid: string;
  profile: UserProfile;
  jurisdiction: Jurisdiction;
}

export interface ProfileResponse {
  success: boolean;
  profile: UserProfile;
  jurisdiction: Jurisdiction;
}

// === KYC ===

export interface KYCStartRequest {
  uid: string;
  documents?: {
    idType: string;
    frontImage: string;
    backImage?: string;
  };
}

export interface KYCStartResponse {
  success: boolean;
  sessionId: string;
  status: KYCStatus;
}

export interface KYCStatusRequest {
  uid: string;
  sessionId?: string;
}

export interface KYCStatusResponse {
  success: boolean;
  status: KYCStatus;
  lastCheckedAt: string;
  rejectionReason?: string;
}

export interface KYCSaveRequest {
  uid: string;
  kycData: KYCData;
}

export interface KYCSaveResponse {
  success: boolean;
}

// === WALLET ===

export interface WalletLinkRequest {
  uid: string;
  publicKey: string;
  signature: string;
  message: string;
  isGenerated?: boolean;
}

export interface WalletLinkResponse {
  success: boolean;
  wallet: UserWallet;
}

// === BROKER ===

export interface BrokerSubaccountRequest {
  uid: string;
  consentDataSharing: boolean;
  consentOmnibus: boolean;
}

export interface BrokerSubaccountResponse {
  success: boolean;
  broker: UserBroker;
}

// === SECURITY ===

export interface SecuritySetupRequest {
  uid: string;
  method: TwoFAMethod;
  credential?: string; // For TOTP secret or WebAuthn credential
}

export interface SecuritySetupResponse {
  success: boolean;
  security: UserSecurity;
  backupCodes?: string[];
}

// === PREFERENCES ===

export interface PreferencesRequest {
  uid: string;
  preferences: UserPreferences;
}

export interface PreferencesResponse {
  success: boolean;
  preferences: UserPreferences;
}

// === STEP MANAGEMENT ===

export interface UpdateStepRequest {
  uid: string;
  step: OnboardingStep;
  completed?: boolean;
}

export interface UpdateStepResponse {
  success: boolean;
  currentStep: OnboardingStep;
}
