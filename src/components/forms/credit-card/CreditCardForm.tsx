"use client";

import { useState } from "react";
import { BillingAddressSection } from "./BillingAddressSection";
import { CardInfoSection } from "./CardInfoSection";
import { getDemoData } from "./demo-data";
import { formatCardNumber, formatCVV, formatExpiryDate } from "./formatting";
import type {
  BillingAddress,
  CreditCardFormData,
  CreditCardFormProps,
  FormErrors,
} from "./types";
import { validateForm } from "./validation";

export function CreditCardForm({
  onSubmit,
  className = "",
}: CreditCardFormProps) {
  const [formData, setFormData] = useState<CreditCardFormData>(getDemoData());
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof CreditCardFormData,
    value: string,
  ) => {
    if (field === "cardNumber") {
      value = formatCardNumber(value);
    } else if (field === "expiryDate") {
      value = formatExpiryDate(value);
    } else if (field === "cvv") {
      value = formatCVV(value);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleBillingAddressChange = (
    field: keyof BillingAddress,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value,
      },
    }));

    // Clear billing address error when user starts typing
    if (errors.billingAddress) {
      setErrors((prev) => ({
        ...prev,
        billingAddress: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      if (onSubmit) {
        onSubmit(formData);
      }

      console.log("Credit card form submitted:", formData);
      alert("Payment information submitted successfully!");

      // Reset form (with demo data in development)
      setFormData(getDemoData());
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Payment Information
        </h2>
        {/* {process.env.NODE_ENV === "development" && (
          <p className="text-sm text-orange-600 dark:text-orange-400 mt-1 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
            🔧 Development mode: Form pre-filled with demo data
          </p>
        )} */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <CardInfoSection
          cardInfo={{
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv,
            cardholderName: formData.cardholderName,
          }}
          errors={errors}
          isSubmitting={isSubmitting}
          onCardNumberChange={(value) => handleInputChange("cardNumber", value)}
          onExpiryDateChange={(value) => handleInputChange("expiryDate", value)}
          onCVVChange={(value) => handleInputChange("cvv", value)}
          onCardholderNameChange={(value) =>
            handleInputChange("cardholderName", value)
          }
        />

        <BillingAddressSection
          billingAddress={formData.billingAddress}
          errors={errors}
          isSubmitting={isSubmitting}
          onBillingAddressChange={handleBillingAddressChange}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {isSubmitting ? "Processing..." : "Submit Payment"}
        </button>
      </form>

      {/* Security Notice */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>🔒 Your payment information is secure and encrypted</p>
      </div>
    </div>
  );
}
