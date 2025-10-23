/**
 * Onboarding hooks and utilities index
 *
 * This file provides a centralized export for all onboarding-related
 * hooks, utilities, and types.
 */

// Main hook
export { useOnboardingState } from "./useOnboardingState";

// API utilities
export { OnboardingAPI, makeAuthenticatedRequest } from "./onboarding-api";

// Navigation utilities
export {
  STEP_ORDER,
  isStepCompleted,
  isStepAccessible,
  getNextStep,
  getPreviousStep,
  calculateProgress,
  getStepTitle,
  getStepDescription,
  isOnboardingComplete,
  getRequiredSteps,
  getOptionalSteps,
  isStepRequired,
  getCurrentStepIndex,
  getRemainingSteps,
  estimateTimeRemaining,
} from "./onboarding-navigation";

// Types
export type {
  OnboardingState,
  OnboardingActions,
  UseOnboardingStateReturn,
} from "./onboarding-hook-types";

// Re-export commonly used types from the main types file
export type {
  User,
  OnboardingStep,
  UserProfile,
  UserPreferences,
  KYCData,
  ConsentResponse,
  ProfileResponse,
  KYCStartResponse,
  KYCStatusResponse,
  WalletLinkResponse,
  BrokerSubaccountResponse,
  SecuritySetupResponse,
  PreferencesResponse,
  UpdateStepResponse,
} from "@/types/onboarding";
