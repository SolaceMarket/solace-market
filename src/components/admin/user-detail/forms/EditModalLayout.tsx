"use client";

import type { EditMode } from "../types";

interface EditModalLayoutProps {
  mode: EditMode;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  children: React.ReactNode;
}

export default function EditModalLayout({
  mode,
  onClose,
  onSubmit,
  loading,
  children,
}: EditModalLayoutProps) {
  const getModalTitle = () => {
    switch (mode) {
      case "onboarding":
        return "Edit Onboarding Status";
      case "profile":
        return "Edit Profile Information";
      case "wallet":
        return "Edit Wallet Information";
      case "kyc":
        return "Edit KYC Information";
      case "broker":
        return "Edit Broker Information";
      case "firebase":
        return "Edit Firebase Information";
      case "security":
        return "Edit Security Information";
      case "preferences":
        return "Edit Preferences";
      default:
        return "Edit Information";
    }
  };

  const getModalWidth = () => {
    switch (mode) {
      case "kyc":
      case "preferences":
        return "w-[600px] max-w-4xl";
      default:
        return "w-96";
    }
  };

  if (!mode) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className={`relative top-20 mx-auto p-5 border shadow-lg rounded-md bg-white ${getModalWidth()}`}>
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {getModalTitle()}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="mb-4">
              {children}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}