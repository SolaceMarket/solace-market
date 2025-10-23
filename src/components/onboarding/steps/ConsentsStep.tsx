"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import type { Locale } from "@/types/onboarding";

interface ConsentsStepProps {
  locale: Locale;
  onNext: () => void;
  onPrevious: () => void;
}

export function ConsentsStep({
  locale,
  onNext,
  onPrevious,
}: ConsentsStepProps) {
  const t = useTranslations(locale);
  const { saveConsents } = useOnboardingState();

  const [consents, setConsents] = useState({
    tos: false,
    privacy: false,
    risk: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConsentChange = (type: keyof typeof consents, value: boolean) => {
    setConsents((prev) => ({ ...prev, [type]: value }));
    setError(null);
  };

  const handleNext = async () => {
    console.log("ConsentsStep: Processing consents", consents);

    // Validate all consents are accepted
    if (!consents.tos || !consents.privacy || !consents.risk) {
      setError("All consents must be accepted to continue");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await saveConsents(consents);
      console.log("ConsentsStep: Successfully saved consents");
      onNext();
    } catch (err) {
      console.error("ConsentsStep: Failed to save consents:", err);
      setError(err instanceof Error ? err.message : "Failed to save consents");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allConsentsAccepted = consents.tos && consents.privacy && consents.risk;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("consents.title") || "Legal Agreements"}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {t("consents.subtitle") ||
            "Please review and accept the following agreements to continue"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Terms of Service */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <input
              type="checkbox"
              id="tos"
              checked={consents.tos}
              onChange={(e) => handleConsentChange("tos", e.target.checked)}
              className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <div className="flex-1">
              <label
                htmlFor="tos"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                {t("consents.tos.title") || "Terms of Service"}
              </label>
              <p className="text-sm text-gray-600 mb-3">
                {t("consents.tos.description") ||
                  "I agree to the Terms of Service and understand the conditions for using this platform."}
              </p>
              <a
                href="/legal/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                {t("consents.tos.link") || "Read Terms of Service"}
              </a>
            </div>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <input
              type="checkbox"
              id="privacy"
              checked={consents.privacy}
              onChange={(e) => handleConsentChange("privacy", e.target.checked)}
              className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <div className="flex-1">
              <label
                htmlFor="privacy"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                {t("consents.privacy.title") || "Privacy Policy"}
              </label>
              <p className="text-sm text-gray-600 mb-3">
                {t("consents.privacy.description") ||
                  "I agree to the Privacy Policy and understand how my personal data will be processed."}
              </p>
              <a
                href="/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                {t("consents.privacy.link") || "Read Privacy Policy"}
              </a>
            </div>
          </div>
        </div>

        {/* Risk Disclosure */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <input
              type="checkbox"
              id="risk"
              checked={consents.risk}
              onChange={(e) => handleConsentChange("risk", e.target.checked)}
              className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <div className="flex-1">
              <label
                htmlFor="risk"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                {t("consents.risk.title") || "Risk Disclosure"}
              </label>
              <p className="text-sm text-gray-600 mb-3">
                {t("consents.risk.description") ||
                  "I acknowledge that I have read and understood the risks associated with trading financial instruments."}
              </p>
              <a
                href="/legal/risk-disclosure"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                {t("consents.risk.link") || "Read Risk Disclosure"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          {t("common.previous") || "Previous"}
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!allConsentsAccepted || isSubmitting}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            allConsentsAccepted && !isSubmitting
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting
            ? t("common.processing") || "Processing..."
            : t("common.continue") || "Continue"}
        </button>
      </div>
    </div>
  );
}
