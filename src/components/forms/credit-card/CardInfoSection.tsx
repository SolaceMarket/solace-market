"use client";

import type { CardInfo, FormErrors } from "./types";

interface CardInfoSectionProps {
  cardInfo: CardInfo;
  errors: FormErrors;
  isSubmitting: boolean;
  onCardNumberChange: (value: string) => void;
  onExpiryDateChange: (value: string) => void;
  onCVVChange: (value: string) => void;
  onCardholderNameChange: (value: string) => void;
}

export function CardInfoSection({
  cardInfo,
  errors,
  isSubmitting,
  onCardNumberChange,
  onExpiryDateChange,
  onCVVChange,
  onCardholderNameChange,
}: CardInfoSectionProps) {
  return (
    <div className="space-y-4">
      {/* Cardholder Name */}
      <div>
        <label
          htmlFor="cardholderName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Cardholder Name
        </label>
        <input
          id="cardholderName"
          type="text"
          value={cardInfo.cardholderName}
          onChange={(e) => onCardholderNameChange(e.target.value)}
          placeholder="John Doe"
          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
            errors.cardholderName
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-gray-600"
          }`}
          disabled={isSubmitting}
        />
        {errors.cardholderName && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-1">
            {errors.cardholderName}
          </p>
        )}
      </div>

      {/* Card Number */}
      <div>
        <label
          htmlFor="cardNumber"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Card Number
        </label>
        <input
          id="cardNumber"
          type="text"
          value={cardInfo.cardNumber}
          onChange={(e) => onCardNumberChange(e.target.value)}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
            errors.cardNumber
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-gray-600"
          }`}
          disabled={isSubmitting}
        />
        {errors.cardNumber && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-1">
            {errors.cardNumber}
          </p>
        )}
      </div>

      {/* Expiry Date and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="expiryDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Expiry Date
          </label>
          <input
            id="expiryDate"
            type="text"
            value={cardInfo.expiryDate}
            onChange={(e) => onExpiryDateChange(e.target.value)}
            placeholder="MM/YY"
            maxLength={5}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
              errors.expiryDate
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            disabled={isSubmitting}
          />
          {errors.expiryDate && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.expiryDate}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cvv"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            CVV
          </label>
          <input
            id="cvv"
            type="text"
            value={cardInfo.cvv}
            onChange={(e) => onCVVChange(e.target.value)}
            placeholder="123"
            maxLength={4}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
              errors.cvv
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            disabled={isSubmitting}
          />
          {errors.cvv && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.cvv}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
