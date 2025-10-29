import { ShieldCheck, Smartphone, X } from "lucide-react";
import { useState } from "react";
import type { SecuritySettings } from "@/data/securityData";

interface TwoFactorAuthProps {
  settings: SecuritySettings;
  onSettingsChange: (settings: SecuritySettings) => void;
}

export function TwoFactorAuth({
  settings,
  onSettingsChange,
}: TwoFactorAuthProps) {
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMFASetup = async () => {
    setIsLoading(true);
    try {
      // Simulate MFA setup
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onSettingsChange({
        ...settings,
        twoFactorEnabled: true,
        backupCodesGenerated: true,
      });
      setShowMFASetup(false);
      alert("Two-factor authentication enabled successfully!");
    } catch (_error) {
      alert("Failed to enable two-factor authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold flex items-center">
          <Smartphone className="w-5 h-5 mr-2 text-emerald-400" />
          Two-Factor Authentication
        </h3>
        {settings.twoFactorEnabled ? (
          <span className="flex items-center text-emerald-400 text-sm">
            <ShieldCheck className="w-4 h-4 mr-1" />
            Enabled
          </span>
        ) : (
          <span className="flex items-center text-red-400 text-sm">
            <X className="w-4 h-4 mr-1" />
            Disabled
          </span>
        )}
      </div>

      <p className="text-gray-400 text-sm mb-3">
        Add an extra layer of security with authenticator app verification.
      </p>

      {settings.twoFactorEnabled ? (
        <div className="space-y-3">
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-emerald-400 text-sm font-semibold">
              Two-factor authentication is active
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Your account is protected with TOTP authentication
            </p>
          </div>
          <button
            type="button"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Disable 2FA
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {!showMFASetup ? (
            <button
              type="button"
              onClick={() => setShowMFASetup(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Enable Two-Factor Auth
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">
                  Setup Instructions:
                </h4>
                <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                  <li>
                    Download an authenticator app (Google Authenticator, Authy)
                  </li>
                  <li>Scan the QR code or enter the secret key</li>
                  <li>Enter the 6-digit code from your app</li>
                </ol>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-800 text-sm text-center mb-2">
                  QR Code would appear here
                </p>
                <div className="w-32 h-32 bg-gray-200 mx-auto rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-xs">QR Code</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleMFASetup}
                  disabled={isLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? "Enabling..." : "Complete Setup"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMFASetup(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
