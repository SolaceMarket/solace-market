"use client";

import type { Locale, OnboardingStep } from "@/types/onboarding";
import { useTranslations } from "@/lib/i18n";

const stepOrder: OnboardingStep[] = [
  "welcome",
  "consents",
  "profile",
  "kyc",
  //   "wallet",
  //   "broker",
  //   "security",
  //   "preferences",
  //   "tour",
  "done",
];

interface OnboardingStepperProps {
  locale: Locale;
  activeStep: OnboardingStep;
  isStepCompleted: (step: OnboardingStep) => boolean;
  isStepAccessible: (step: OnboardingStep) => boolean;
  onNavigateToStep: (step: OnboardingStep) => void;
}

export function OnboardingStepper({
  locale,
  activeStep,
  isStepCompleted,
  isStepAccessible,
  onNavigateToStep,
}: OnboardingStepperProps) {
  const t = useTranslations(locale);

  return (
    <div className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {stepOrder.slice(0, -1).map((step, index) => {
            const isActive = step === activeStep;
            const isCompleted = isStepCompleted(step);
            const isAccessible = isStepAccessible(step);

            return (
              <div key={step} className="flex items-center">
                {/* Step Circle */}
                <button
                  type="button"
                  onClick={() => onNavigateToStep(step)}
                  disabled={!isAccessible}
                  className={`
                    relative w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors
                    ${
                      isCompleted
                        ? "bg-green-600 border-green-600 text-white"
                        : isActive
                          ? "bg-blue-600 border-blue-600 text-white"
                          : isAccessible
                            ? "border-gray-300 text-gray-700 hover:border-gray-400"
                            : "border-gray-200 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
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
                  ) : (
                    index + 1
                  )}
                </button>

                {/* Step Label */}
                <span
                  className={`ml-3 text-sm font-medium ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {t("stepper." + step)}
                </span>

                {/* Connector Line */}
                {index < stepOrder.length - 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-6 ${
                      isStepCompleted(stepOrder[index + 1])
                        ? "bg-green-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
