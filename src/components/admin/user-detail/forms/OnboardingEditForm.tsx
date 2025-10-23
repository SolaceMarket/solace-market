"use client";

import { type DetailedUser } from "../types";

interface OnboardingEditFormProps {
  formData: Record<string, unknown>;
  setFormData: (data: Record<string, unknown>) => void;
}

export default function OnboardingEditForm({
  formData,
  setFormData,
}: OnboardingEditFormProps) {
  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="currentStep"
          className="block text-sm font-medium text-gray-700"
        >
          Current Step
        </label>
        <select
          id="currentStep"
          value={(formData.currentStep as string) || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              currentStep: e.target.value,
            })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select step</option>
          <option value="welcome">Welcome</option>
          <option value="consents">Consents</option>
          <option value="profile">Profile</option>
          <option value="kyc">KYC</option>
          <option value="wallet">Wallet</option>
          <option value="trading">Trading</option>
          <option value="confirmation">Confirmation</option>
        </select>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="completed"
          checked={(formData.completed as boolean) || false}
          onChange={(e) =>
            setFormData({
              ...formData,
              completed: e.target.checked,
            })
          }
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="completed"
          className="ml-2 block text-sm text-gray-900"
        >
          Mark as completed
        </label>
      </div>
    </div>
  );
}