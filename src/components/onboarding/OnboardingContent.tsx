"use client";

import type { Locale, OnboardingStep } from "@/types/onboarding";
import { WelcomeStep } from "./steps/WelcomeStep";
import { PlaceholderStep } from "./steps/PlaceholderStep";
import { ConsentsStep } from "./steps/ConsentsStep";
import { ProfileStep } from "./steps/ProfileStep";
import { KYCStep } from "./steps/KYCStep";

interface OnboardingContentProps {
  locale: Locale;
  activeStep: OnboardingStep;
  onNext: () => void;
  onPrevious: () => void;
}

export function OnboardingContent({
  locale,
  activeStep,
  onNext,
  onPrevious,
}: OnboardingContentProps) {
  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="mb-8">
          {activeStep === "welcome" && (
            <WelcomeStep locale={locale} onNext={onNext} />
          )}

          {activeStep === "consents" && (
            <ConsentsStep
              locale={locale}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          )}

          {activeStep === "profile" && (
            <ProfileStep
              locale={locale}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          )}

          {activeStep === "kyc" && (
            <KYCStep locale={locale} onPrevious={onPrevious} onNext={onNext} />
          )}
        </div>
      </div>
    </main>
  );
}
