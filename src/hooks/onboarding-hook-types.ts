"use client";

import type {
  User,
  OnboardingStep,
  ConsentResponse,
  ProfileResponse,
  KYCStartResponse,
  KYCStatusResponse,
  WalletLinkResponse,
  BrokerSubaccountResponse,
  SecuritySetupResponse,
  PreferencesResponse,
  UpdateStepResponse,
  UserProfile,
  UserPreferences,
  KYCData,
} from "@/types/onboarding";

/**
 * Onboarding state interface
 */
export interface OnboardingState {
  user: User | null;
  loading: boolean;
  error: string | null;
  currentStep: OnboardingStep;
  isStepCompleted: (step: OnboardingStep) => boolean;
  isStepAccessible: (step: OnboardingStep) => boolean;
}

/**
 * Onboarding actions interface
 */
export interface OnboardingActions {
  initializeOnboarding: () => Promise<void>;
  updateStep: (
    step: OnboardingStep,
    completed?: boolean,
  ) => Promise<UpdateStepResponse>;
  saveConsents: (consents: {
    tos: boolean;
    privacy: boolean;
    risk: boolean;
  }) => Promise<ConsentResponse>;
  saveProfile: (
    profile: UserProfile,
    jurisdiction?: string,
  ) => Promise<ProfileResponse>;
  saveKYC: (kycData: KYCData) => Promise<void>;
  startKYC: (documents?: Record<string, unknown>) => Promise<KYCStartResponse>;
  checkKYCStatus: (sessionId?: string) => Promise<KYCStatusResponse>;
  linkWallet: (
    publicKey: string,
    signature: string,
    message: string,
    isGenerated?: boolean,
  ) => Promise<WalletLinkResponse>;
  createBrokerAccount: (
    consentDataSharing: boolean,
    consentOmnibus: boolean,
  ) => Promise<BrokerSubaccountResponse>;
  setup2FA: (
    method: "webauthn" | "totp",
    credential?: string,
  ) => Promise<SecuritySetupResponse>;
  skip2FA: () => Promise<void>;
  savePreferences: (
    preferences: UserPreferences,
  ) => Promise<PreferencesResponse>;
  completeOnboarding: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

/**
 * Combined hook return type
 */
export type UseOnboardingStateReturn = OnboardingState & OnboardingActions;
