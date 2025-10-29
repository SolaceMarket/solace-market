/**
 * Onboarding hooks and utilities index
 *
 * This file provides a centralized export for all onboarding-related
 * hooks, utilities, and types.
 */

// Re-export commonly used types from the main types file
export type {
  BrokerSubaccountResponse,
  ConsentResponse,
  KYCData,
  KYCStartResponse,
  KYCStatusResponse,
  OnboardingStep,
  PreferencesResponse,
  ProfileResponse,
  SecuritySetupResponse,
  UpdateStepResponse,
  User,
  UserPreferences,
  UserProfile,
  WalletLinkResponse,
} from "@/types/onboarding";
// API utilities
export { makeAuthenticatedRequest, OnboardingAPI } from "./onboarding-api";
// Types
export type {
  OnboardingActions,
  OnboardingState,
  UseOnboardingStateReturn,
} from "./onboarding-hook-types";
// Navigation utilities
export {
  calculateProgress,
  estimateTimeRemaining,
  getCurrentStepIndex,
  getNextStep,
  getOptionalSteps,
  getPreviousStep,
  getRemainingSteps,
  getRequiredSteps,
  getStepDescription,
  getStepTitle,
  isOnboardingComplete,
  isStepAccessible,
  isStepCompleted,
  isStepRequired,
  STEP_ORDER,
} from "./onboarding-navigation";
// Web3 hooks
export { useInitialization } from "./useInitialization";
// Main hook
export { useOnboardingState } from "./useOnboardingState";
export { useWalletRedirect } from "./useWalletRedirect";
