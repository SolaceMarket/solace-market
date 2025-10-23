"use client";

import type { Locale } from "@/types/onboarding";
import { useTranslations } from "@/lib/i18n";

interface PlaceholderStepProps {
  locale: Locale;
  stepName: string;
  onNext: () => void;
  onPrevious: () => void;
}

export function PlaceholderStep({
  locale,
  stepName,
  onNext,
  onPrevious,
}: PlaceholderStepProps) {
  const t = useTranslations(locale);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {t("stepper." + stepName)}
      </h2>
      <p className="text-gray-600 mb-6">
        Step content will be implemented here.
      </p>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
        >
          {t("common.previous")}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {t("common.next")}
        </button>
      </div>
    </div>
  );
}
