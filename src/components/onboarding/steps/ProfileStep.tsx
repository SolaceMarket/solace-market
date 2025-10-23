"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/lib/i18n";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import type {
  Locale,
  UserProfile,
  ExperienceLevel,
  Jurisdiction,
} from "@/types/onboarding";

interface ProfileStepProps {
  locale: Locale;
  onNext: () => void;
  onPrevious: () => void;
}

export function ProfileStep({ locale, onNext, onPrevious }: ProfileStepProps) {
  const t = useTranslations(locale);
  const { user, saveProfile } = useOnboardingState();

  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    dob: "",
    country: "",
    taxResidency: "",
    address: "",
    phone: "",
    experience: "beginner",
  });
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("EU");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing profile data if available
  useEffect(() => {
    if (user?.profile) {
      setProfile(user.profile);
    }
    if (user?.jurisdiction) {
      setJurisdiction(user.jurisdiction);
    }
  }, [user]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateProfile = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "dob",
      "country",
      "taxResidency",
      "address",
    ];
    const missingFields = requiredFields.filter(
      (field) => !profile[field as keyof UserProfile],
    );

    if (missingFields.length > 0) {
      return `Please fill in all required fields: ${missingFields.join(", ")}`;
    }

    // Basic DOB validation (must be at least 18 years old)
    const birthDate = new Date(profile.dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      age < 18 ||
      (age === 18 && monthDiff < 0) ||
      (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return "You must be at least 18 years old to continue";
    }

    return null;
  };

  const handleNext = async () => {
    console.log("ProfileStep: Processing profile", profile);

    const validationError = validateProfile();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await saveProfile(profile, jurisdiction);
      console.log("ProfileStep: Successfully saved profile");
      onNext();
    } catch (err) {
      console.error("ProfileStep: Failed to save profile:", err);
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const countries = [
    { code: "DE", name: "Germany" },
    { code: "AT", name: "Austria" },
    { code: "CH", name: "Switzerland" },
    { code: "FR", name: "France" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "NL", name: "Netherlands" },
    { code: "BE", name: "Belgium" },
    { code: "PT", name: "Portugal" },
    { code: "PL", name: "Poland" },
    { code: "CZ", name: "Czech Republic" },
    { code: "HU", name: "Hungary" },
    { code: "SK", name: "Slovakia" },
    { code: "SI", name: "Slovenia" },
    { code: "HR", name: "Croatia" },
    { code: "RO", name: "Romania" },
    { code: "BG", name: "Bulgaria" },
    { code: "GR", name: "Greece" },
    { code: "CY", name: "Cyprus" },
    { code: "MT", name: "Malta" },
    { code: "LU", name: "Luxembourg" },
    { code: "IE", name: "Ireland" },
    { code: "DK", name: "Denmark" },
    { code: "SE", name: "Sweden" },
    { code: "FI", name: "Finland" },
    { code: "EE", name: "Estonia" },
    { code: "LV", name: "Latvia" },
    { code: "LT", name: "Lithuania" },
    { code: "US", name: "United States" },
    { code: "OTHER", name: "Other" },
  ];

  const experienceLevels: Array<{ value: ExperienceLevel; label: string }> = [
    { value: "beginner", label: "Beginner (0-1 years)" },
    { value: "intermediate", label: "Intermediate (1-5 years)" },
    { value: "advanced", label: "Advanced (5+ years)" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("profile.title") || "Personal Information"}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {t("profile.subtitle") ||
            "Please provide your personal information for account verification"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("profile.fields.firstName") || "First Name"} *
          </label>
          <input
            type="text"
            id="firstName"
            value={profile.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("profile.fields.lastName") || "Last Name"} *
          </label>
          <input
            type="text"
            id="lastName"
            value={profile.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label
            htmlFor="dob"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("profile.fields.dob") || "Date of Birth"} *
          </label>
          <input
            type="date"
            id="dob"
            value={profile.dob}
            onChange={(e) => handleInputChange("dob", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("profile.fields.country") || "Country"} *
          </label>
          <select
            id="country"
            value={profile.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            required
          >
            <option value="">
              {t("profile.fields.selectCountry") || "Select Country"}
            </option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tax Residency */}
        <div>
          <label
            htmlFor="taxResidency"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("profile.fields.taxResidency") || "Tax Residency"} *
          </label>
          <select
            id="taxResidency"
            value={profile.taxResidency}
            onChange={(e) => handleInputChange("taxResidency", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            required
          >
            <option value="">
              {t("profile.fields.selectTaxResidency") || "Select Tax Residency"}
            </option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("profile.fields.experience") || "Trading Experience"} *
          </label>
          <select
            id="experience"
            value={profile.experience}
            onChange={(e) =>
              handleInputChange("experience", e.target.value as ExperienceLevel)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            required
          >
            {experienceLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {t("profile.fields.address") || "Address"} *
        </label>
        <textarea
          id="address"
          rows={3}
          value={profile.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
          required
          placeholder={
            t("profile.addressPlaceholder") || "Enter your full address"
          }
        />
      </div>

      {/* Phone (Optional) */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {t("profile.fields.phone") || "Phone Number"}{" "}
          <span className="text-gray-500">(Optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          value={profile.phone || ""}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
          placeholder={t("profile.phonePlaceholder") || "+49 123 456 789"}
        />
      </div>

      {/* Jurisdiction Selection */}
      <div>
        <label
          htmlFor="jurisdiction"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {t("profile.jurisdiction") || "Regulatory Jurisdiction"} *
        </label>
        <select
          id="jurisdiction"
          value={jurisdiction}
          onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
          required
        >
          <option value="EU">European Union (EU)</option>
          <option value="DE">Germany (DE)</option>
          <option value="US">United States (US)</option>
          <option value="Other">Other</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">
          {t("profile.jurisdictionHelp") ||
            "This determines which regulations apply to your account"}
        </p>
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
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            !isSubmitting
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
