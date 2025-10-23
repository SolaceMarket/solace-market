"use client";

import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/firebase/InitializeFirebase";
import { OnboardingAPI } from "./onboarding-api";
import { isStepCompleted, isStepAccessible } from "./onboarding-navigation";
import type { UseOnboardingStateReturn } from "./onboarding-hook-types";
import type {
  User,
  OnboardingStep,
  UserProfile,
  UserPreferences,
  KYCData,
} from "@/types/onboarding";

/**
 * Main onboarding state management hook
 * Provides state and actions for the entire onboarding flow
 */
export function useOnboardingState(): UseOnboardingStateReturn {
  // State management
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Helper functions
  const clearError = useCallback(() => setError(null), []);

  // Core actions
  const initializeOnboarding = useCallback(async () => {
    if (!firebaseUser?.email || !firebaseUser?.uid) {
      throw new Error("User authentication required");
    }

    clearError();
    setIsLoading(true);

    try {
      const response = await OnboardingAPI.initializeOnboarding(
        firebaseUser.uid,
        firebaseUser.email,
        "de", // TODO: Get from user's browser/preference
      );

      setUser(response.user);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize onboarding";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [firebaseUser, clearError]);

  const refreshUser = useCallback(async () => {
    if (!firebaseUser?.uid) return;

    try {
      const response = await OnboardingAPI.refreshUser();
      setUser(response.user);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  }, [firebaseUser]);

  // Step-specific actions
  const saveConsents = useCallback(
    async (consents: { tos: boolean; privacy: boolean; risk: boolean }) => {
      if (!firebaseUser?.uid) throw new Error("User not authenticated");

      clearError();

      try {
        const response = await OnboardingAPI.saveConsents(
          firebaseUser.uid,
          consents,
        );
        await refreshUser();
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to save consents";
        setError(errorMessage);
        throw err;
      }
    },
    [firebaseUser, clearError, refreshUser],
  );

  const saveProfile = useCallback(
    async (profile: UserProfile, jurisdiction?: string) => {
      if (!firebaseUser?.uid) throw new Error("User not authenticated");

      clearError();

      try {
        const response = await OnboardingAPI.saveProfile(
          firebaseUser.uid,
          profile,
          jurisdiction,
        );
        await refreshUser();
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to save profile";
        setError(errorMessage);
        throw err;
      }
    },
    [firebaseUser, clearError, refreshUser],
  );

  const saveKYC = useCallback(
    async (kycData: KYCData) => {
      if (!firebaseUser?.uid) throw new Error("User not authenticated");

      clearError();

      try {
        await OnboardingAPI.saveKYC(firebaseUser.uid, kycData);
        await refreshUser();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to save KYC data";
        setError(errorMessage);
        throw err;
      }
    },
    [firebaseUser, clearError, refreshUser],
  );

  const startKYC = useCallback(
    async (documents?: Record<string, unknown>) => {
      if (!firebaseUser?.uid) throw new Error("User not authenticated");

      clearError();

      try {
        const response = await OnboardingAPI.startKYC(
          firebaseUser.uid,
          documents,
        );
        await refreshUser();
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to start KYC";
        setError(errorMessage);
        throw err;
      }
    },
    [firebaseUser, clearError, refreshUser],
  );

  const checkKYCStatus = useCallback(
    async (sessionId?: string) => {
      if (!firebaseUser?.uid) throw new Error("User not authenticated");

      clearError();

      try {
        const response = await OnboardingAPI.checkKYCStatus(
          firebaseUser.uid,
          sessionId,
        );
        await refreshUser();
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to check KYC status";
        setError(errorMessage);
        throw err;
      }
    },
    [firebaseUser, clearError, refreshUser],
  );

  const linkWallet = useCallback(
    async (
      publicKey: string,
      signature: string,
      message: string,
      isGenerated?: boolean,
    ) => {
      if (!firebaseUser?.uid) throw new Error("User not authenticated");

      clearError();

      try {
        const response = await OnboardingAPI.linkWallet(
          firebaseUser.uid,
          publicKey,
          signature,
          message,
          isGenerated,
        );
        await refreshUser();
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to link wallet";
        setError(errorMessage);
        throw err;
      }
    },
    [firebaseUser, clearError, refreshUser],
  );

  const createBrokerAccount = useCallback(
    async (consentDataSharing: boolean, consentOmnibus: boolean) => {
      if (!firebaseUser?.uid) throw new Error("User not authenticated");

      clearError();

      try {
        const response = await OnboardingAPI.createBrokerAccount(
          firebaseUser.uid,
          consentDataSharing,
          consentOmnibus,
        );
        await refreshUser();
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to create broker account";
        setError(errorMessage);
        throw err;
      }
    },
    [firebaseUser, clearError, refreshUser],
  );

  const setup2FA = useCallback(
    async (method: "webauthn" | "totp", credential?: string) => {
      if (!firebaseUser?.uid) throw new Error("User not authenticated");

      clearError();

      try {
        const response = await OnboardingAPI.setup2FA(
          firebaseUser.uid,
          method,
          credential,
        );
        await refreshUser();
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to setup 2FA";
        setError(errorMessage);
        throw err;
      }
    },
    [firebaseUser, clearError, refreshUser],
  );

  const skip2FA = useCallback(async () => {
    if (!firebaseUser?.uid) throw new Error("User not authenticated");

    clearError();

    try {
      await OnboardingAPI.skip2FA();
      await refreshUser();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to skip 2FA";
      setError(errorMessage);
      throw err;
    }
  }, [firebaseUser, clearError, refreshUser]);

  const savePreferences = useCallback(
    async (preferences: UserPreferences) => {
      if (!firebaseUser?.uid) throw new Error("User not authenticated");

      clearError();

      try {
        const response = await OnboardingAPI.savePreferences(
          firebaseUser.uid,
          preferences,
        );
        await refreshUser();
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to save preferences";
        setError(errorMessage);
        throw err;
      }
    },
    [firebaseUser, clearError, refreshUser],
  );

  const updateStep = useCallback(
    async (step: OnboardingStep, completed: boolean = false) => {
      if (!firebaseUser?.uid) throw new Error("User not authenticated");

      clearError();

      try {
        const response = await OnboardingAPI.updateStep(
          firebaseUser.uid,
          step,
          completed,
        );
        await refreshUser();
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update step";
        setError(errorMessage);
        throw err;
      }
    },
    [firebaseUser, clearError, refreshUser],
  );

  const completeOnboarding = useCallback(async () => {
    if (!user) return;

    // Update to final step
    setUser((prev) =>
      prev
        ? {
            ...prev,
            onboarding: {
              ...prev.onboarding,
              currentStep: "done",
              completed: true,
              completedAt: new Date().toISOString(),
            },
          }
        : null,
    );
  }, [user]);

  // Memoized helper functions
  const stepCompletedChecker = useCallback(
    (step: OnboardingStep) => isStepCompleted(user, step),
    [user],
  );

  const stepAccessibilityChecker = useCallback(
    (step: OnboardingStep) => isStepAccessible(user, step),
    [user],
  );

  // Initialize user on first load
  useEffect(() => {
    if (firebaseUser && !authLoading && !user) {
      initializeOnboarding().catch(console.error);
    }
  }, [firebaseUser, authLoading, user, initializeOnboarding]);

  // Return combined state and actions
  return {
    // State
    user,
    loading: authLoading || isLoading,
    error,
    currentStep: user?.onboarding.currentStep || "welcome",
    isStepCompleted: stepCompletedChecker,
    isStepAccessible: stepAccessibilityChecker,

    // Actions
    initializeOnboarding,
    updateStep,
    saveConsents,
    saveProfile,
    saveKYC,
    startKYC,
    checkKYCStatus,
    linkWallet,
    createBrokerAccount,
    setup2FA,
    skip2FA,
    savePreferences,
    completeOnboarding,
    refreshUser,
  };
}
