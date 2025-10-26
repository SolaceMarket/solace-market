"use client";

import type { BillingAddress, FormErrors } from "./types";

interface BillingAddressSectionProps {
  billingAddress: BillingAddress;
  errors: FormErrors;
  isSubmitting: boolean;
  onBillingAddressChange: (field: keyof BillingAddress, value: string) => void;
}

export function BillingAddressSection({
  billingAddress,
  errors,
  isSubmitting,
  onBillingAddressChange,
}: BillingAddressSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Billing Address
      </h3>

      <div className="space-y-3">
        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Street Address
          </label>
          <input
            id="street"
            type="text"
            value={billingAddress.street}
            onChange={(e) => onBillingAddressChange("street", e.target.value)}
            placeholder="123 Main St"
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
              errors.billingAddress
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              City
            </label>
            <input
              id="city"
              type="text"
              value={billingAddress.city}
              onChange={(e) => onBillingAddressChange("city", e.target.value)}
              placeholder="New York"
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                errors.billingAddress
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              State
            </label>
            <input
              id="state"
              type="text"
              value={billingAddress.state}
              onChange={(e) => onBillingAddressChange("state", e.target.value)}
              placeholder="NY"
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                errors.billingAddress
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              ZIP Code
            </label>
            <input
              id="zipCode"
              type="text"
              value={billingAddress.zipCode}
              onChange={(e) =>
                onBillingAddressChange("zipCode", e.target.value)
              }
              placeholder="10001"
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                errors.billingAddress
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Country
            </label>
            <select
              id="country"
              value={billingAddress.country}
              onChange={(e) =>
                onBillingAddressChange("country", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                errors.billingAddress
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              disabled={isSubmitting}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
            </select>
          </div>
        </div>

        {errors.billingAddress && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-1">
            {errors.billingAddress}
          </p>
        )}
      </div>
    </div>
  );
}
