"use client";

import type { Locale, OnboardingStep } from "@/types/onboarding";
import { useTranslations } from "@/lib/i18n";

interface OnboardingHeaderProps {
  locale: Locale;
  activeStep: OnboardingStep;
}

export function OnboardingHeader({
  locale,
  activeStep,
}: OnboardingHeaderProps) {
  const t = useTranslations(locale);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Solace.Market</h1>
          <div className="text-sm text-gray-500">
            {t("stepper." + activeStep)}
          </div>
        </div>
      </div>
    </header>
  );
}
