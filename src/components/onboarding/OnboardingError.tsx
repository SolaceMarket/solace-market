"use client";

import type { Locale } from "@/types/onboarding";
import { useTranslations } from "@/lib/i18n";

interface OnboardingErrorProps {
  locale: Locale;
  error: string;
}

export function OnboardingError({ locale, error }: OnboardingErrorProps) {
  const t = useTranslations(locale);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-red-600 text-xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t("common.error")}
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t("common.retry")}
        </button>
      </div>
    </div>
  );
}
