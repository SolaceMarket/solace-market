"use client";

import { auth } from "@/firebase/InitializeFirebase";
import type {
  InitOnboardingResponse,
  ConsentRequest,
  ConsentResponse,
  ProfileRequest,
  ProfileResponse,
  KYCData,
  KYCStartRequest,
  KYCStartResponse,
  KYCStatusRequest,
  KYCStatusResponse,
  WalletLinkRequest,
  WalletLinkResponse,
  BrokerSubaccountRequest,
  BrokerSubaccountResponse,
  SecuritySetupRequest,
  SecuritySetupResponse,
  PreferencesRequest,
  PreferencesResponse,
  UpdateStepResponse,
  OnboardingStep,
  UserProfile,
  UserPreferences,
} from "@/types/onboarding";

/**
 * Makes an authenticated request to the API with Firebase auth token
 */
export async function makeAuthenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: "Request failed",
      message: `HTTP ${response.status}`,
    }));
    throw new Error(errorData.message || errorData.error || "Request failed");
  }

  return response.json();
}

/**
 * API functions for onboarding operations
 */
export const OnboardingAPI = {
  /**
   * Initialize or refresh user onboarding data
   */
  async initializeOnboarding(
    uid: string,
    email: string,
    locale: string = "de",
  ): Promise<InitOnboardingResponse> {
    return makeAuthenticatedRequest<InitOnboardingResponse>(
      "/api/onboarding/init",
      {
        method: "POST",
        body: JSON.stringify({ uid, email, locale }),
      },
    );
  },

  /**
   * Refresh user data
   */
  async refreshUser(): Promise<InitOnboardingResponse> {
    return makeAuthenticatedRequest<InitOnboardingResponse>(
      "/api/onboarding/init",
      { method: "GET" },
    );
  },

  /**
   * Save user consents
   */
  async saveConsents(
    uid: string,
    consents: { tos: boolean; privacy: boolean; risk: boolean },
  ): Promise<ConsentResponse> {
    return makeAuthenticatedRequest<ConsentResponse>(
      "/api/onboarding/consent",
      {
        method: "POST",
        body: JSON.stringify({ uid, consents } as ConsentRequest),
      },
    );
  },

  /**
   * Save user profile information
   */
  async saveProfile(
    uid: string,
    profile: UserProfile,
    jurisdiction?: string,
  ): Promise<ProfileResponse> {
    return makeAuthenticatedRequest<ProfileResponse>(
      "/api/onboarding/profile",
      {
        method: "POST",
        body: JSON.stringify({ uid, profile, jurisdiction } as ProfileRequest),
      },
    );
  },

  /**
   * Save KYC data
   */
  async saveKYC(uid: string, kycData: KYCData): Promise<void> {
    return makeAuthenticatedRequest<void>("/api/onboarding/kyc/save", {
      method: "POST",
      body: JSON.stringify({ uid, kycData }),
    });
  },

  /**
   * Start KYC verification process
   */
  async startKYC(
    uid: string,
    documents?: Record<string, unknown>,
  ): Promise<KYCStartResponse> {
    return makeAuthenticatedRequest<KYCStartResponse>(
      "/api/onboarding/kyc/start",
      {
        method: "POST",
        body: JSON.stringify({ uid, documents } as KYCStartRequest),
      },
    );
  },

  /**
   * Check KYC verification status
   */
  async checkKYCStatus(
    uid: string,
    sessionId?: string,
  ): Promise<KYCStatusResponse> {
    return makeAuthenticatedRequest<KYCStatusResponse>(
      "/api/onboarding/kyc/status",
      {
        method: "POST",
        body: JSON.stringify({ uid, sessionId } as KYCStatusRequest),
      },
    );
  },

  /**
   * Link wallet to user account
   */
  async linkWallet(
    uid: string,
    publicKey: string,
    signature: string,
    message: string,
    isGenerated?: boolean,
  ): Promise<WalletLinkResponse> {
    return makeAuthenticatedRequest<WalletLinkResponse>(
      "/api/onboarding/wallet/link",
      {
        method: "POST",
        body: JSON.stringify({
          uid,
          publicKey,
          signature,
          message,
          isGenerated,
        } as WalletLinkRequest),
      },
    );
  },

  /**
   * Create broker subaccount
   */
  async createBrokerAccount(
    uid: string,
    consentDataSharing: boolean,
    consentOmnibus: boolean,
  ): Promise<BrokerSubaccountResponse> {
    return makeAuthenticatedRequest<BrokerSubaccountResponse>(
      "/api/onboarding/broker/subaccount",
      {
        method: "POST",
        body: JSON.stringify({
          uid,
          consentDataSharing,
          consentOmnibus,
        } as BrokerSubaccountRequest),
      },
    );
  },

  /**
   * Setup 2FA authentication
   */
  async setup2FA(
    uid: string,
    method: "webauthn" | "totp",
    credential?: string,
  ): Promise<SecuritySetupResponse> {
    return makeAuthenticatedRequest<SecuritySetupResponse>(
      "/api/onboarding/security/2fa",
      {
        method: "POST",
        body: JSON.stringify({
          uid,
          method,
          credential,
        } as SecuritySetupRequest),
      },
    );
  },

  /**
   * Skip 2FA setup
   */
  async skip2FA(): Promise<void> {
    return makeAuthenticatedRequest("/api/onboarding/security/2fa", {
      method: "DELETE",
    });
  },

  /**
   * Save user preferences
   */
  async savePreferences(
    uid: string,
    preferences: UserPreferences,
  ): Promise<PreferencesResponse> {
    return makeAuthenticatedRequest<PreferencesResponse>(
      "/api/onboarding/preferences",
      {
        method: "POST",
        body: JSON.stringify({ uid, preferences } as PreferencesRequest),
      },
    );
  },

  /**
   * Update onboarding step progress
   */
  async updateStep(
    uid: string,
    step: OnboardingStep,
    completed: boolean = false,
  ): Promise<UpdateStepResponse> {
    return makeAuthenticatedRequest<UpdateStepResponse>(
      "/api/onboarding/step",
      {
        method: "POST",
        body: JSON.stringify({ uid, step, completed }),
      },
    );
  },
};
