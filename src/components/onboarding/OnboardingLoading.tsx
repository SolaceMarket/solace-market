"use client";

import type { Locale } from "@/types/onboarding";
import { useTranslations } from "@/lib/i18n";

interface OnboardingLoadingProps {
  locale: Locale;
}

export function OnboardingLoading({ locale }: OnboardingLoadingProps) {
  const t = useTranslations(locale);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t("common.loading")}</p>
      </div>
    </div>
  );
}
