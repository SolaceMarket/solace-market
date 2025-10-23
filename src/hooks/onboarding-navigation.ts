"use client";

import type { OnboardingStep, User } from "@/types/onboarding";

/**
 * Onboarding step order and navigation utilities
 */
export const STEP_ORDER: OnboardingStep[] = [
  "welcome",
  "consents",
  "profile",
  "kyc",
  // "wallet",
  // "broker",
  // "security",
  // "preferences",
  // "tour",
  "done",
];

/**
 * Check if a specific onboarding step is completed
 */
export function isStepCompleted(
  user: User | null,
  step: OnboardingStep,
): boolean {
  return user?.onboarding.completedSteps.includes(step) || false;
}

/**
 * Check if a specific onboarding step is accessible to the user
 */
export function isStepAccessible(
  user: User | null,
  step: OnboardingStep,
): boolean {
  if (!user) return false;

  const targetIndex = STEP_ORDER.indexOf(step);
  const currentIndex = STEP_ORDER.indexOf(user.onboarding.currentStep);

  // Allow going back to completed steps or current step
  if (targetIndex <= currentIndex) {
    return true;
  }

  // Allow advancing one step if current step is completed
  if (
    targetIndex === currentIndex + 1 &&
    user.onboarding.completedSteps.includes(user.onboarding.currentStep)
  ) {
    return true;
  }

  return false;
}

/**
 * Get the next step in the onboarding flow
 */
export function getNextStep(
  currentStep: OnboardingStep,
): OnboardingStep | null {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === STEP_ORDER.length - 1) {
    return null;
  }
  return STEP_ORDER[currentIndex + 1];
}

/**
 * Get the previous step in the onboarding flow
 */
export function getPreviousStep(
  currentStep: OnboardingStep,
): OnboardingStep | null {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  if (currentIndex <= 0) {
    return null;
  }
  return STEP_ORDER[currentIndex - 1];
}

/**
 * Calculate onboarding progress as a percentage
 */
export function calculateProgress(user: User | null): number {
  if (!user) return 0;

  const completedCount = user.onboarding.completedSteps.length;
  const totalSteps = STEP_ORDER.length - 1; // Exclude 'done' step from total

  return Math.round((completedCount / totalSteps) * 100);
}

/**
 * Get user-friendly step titles
 */
export function getStepTitle(step: OnboardingStep): string {
  const titles: Record<OnboardingStep, string> = {
    welcome: "Welcome",
    consents: "Legal Agreements",
    profile: "Personal Information",
    kyc: "Identity Verification",
    wallet: "Wallet Connection",
    broker: "Broker Account",
    security: "Security Setup",
    preferences: "Preferences",
    tour: "Platform Tour",
    done: "Complete",
  };

  return titles[step];
} /**
 * Get user-friendly step descriptions
 */
export function getStepDescription(step: OnboardingStep): string {
  const descriptions: Record<OnboardingStep, string> = {
    welcome: "Welcome to Solace Market. Let's get you set up.",
    consents:
      "Please review and accept our terms of service and privacy policy",
    profile: "Tell us a bit about yourself",
    kyc: "Verify your identity to unlock all features",
    wallet: "Connect your Solana wallet",
    broker: "Link your brokerage account",
    security: "Set up two-factor authentication",
    preferences: "Customize your trading preferences",
    tour: "Take a quick tour of the platform",
    done: "You're all set! Welcome to Solace Market.",
  };

  return descriptions[step];
}

/**
 * Check if onboarding is complete
 */
export function isOnboardingComplete(user: User | null): boolean {
  if (!user) return false;
  return user.onboarding.completed || user.onboarding.currentStep === "done";
}

/**
 * Get steps that are required vs optional
 */
/**
 * Get required steps (for computing completion percentage)
 */
export function getRequiredSteps(): OnboardingStep[] {
  return ["welcome", "consents", "profile", "kyc"];
}

export function getOptionalSteps(): OnboardingStep[] {
  return [];
}

/**
 * Check if a step is required
 */
export function isStepRequired(step: OnboardingStep): boolean {
  return getRequiredSteps().includes(step);
}

/**
 * Get the current step index for progress tracking
 */
export function getCurrentStepIndex(user: User | null): number {
  if (!user) return 0;
  return STEP_ORDER.indexOf(user.onboarding.currentStep);
}

/**
 * Get remaining steps in the onboarding flow
 */
export function getRemainingSteps(user: User | null): OnboardingStep[] {
  if (!user) return STEP_ORDER;

  const currentIndex = getCurrentStepIndex(user);
  return STEP_ORDER.slice(currentIndex + 1);
}

/**
 * Estimate time remaining for onboarding (in minutes)
 */
export function estimateTimeRemaining(user: User | null): number {
  const stepTimes: Record<OnboardingStep, number> = {
    welcome: 1,
    consents: 2,
    profile: 3,
    kyc: 5,
    wallet: 2,
    broker: 3,
    security: 3,
    preferences: 2,
    tour: 5,
    done: 0,
  };

  const remainingSteps = getRemainingSteps(user);
  return remainingSteps.reduce((total, step) => total + stepTimes[step], 0);
}
