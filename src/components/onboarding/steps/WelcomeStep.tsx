// "use client";

import { useTranslations } from "@/lib/i18n";
import type { Locale } from "@/types/onboarding";

interface WelcomeStepProps {
  locale: Locale;
  onNext: () => void;
}

export function WelcomeStep({ locale, onNext }: WelcomeStepProps) {
  const t = useTranslations(locale);

  const handleNext = () => {
    console.log("Welcome step: Start button clicked");
    onNext();
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        {t("welcome.title")}
      </h2>
      <p className="text-lg text-gray-600 mb-6">{t("welcome.subtitle")}</p>
      <p className="text-gray-600 mb-8">{t("welcome.description")}</p>

      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("welcome.valueProps.title")}
        </h3>
        <ul className="text-left space-y-2">
          {[
            "Trade tokenized real-world assets",
            "Backed by real collateral and regulated custody",
            "Non-custodial Solana wallet integration",
            "Professional-grade brokerage services",
            "Transparent pricing and low fees",
          ].map((prop) => (
            <li key={prop} className="flex items-center text-gray-700">
              <svg
                className="w-5 h-5 text-green-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {prop}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
      >
        {t("welcome.startButton")}
      </button>
    </div>
  );
}
