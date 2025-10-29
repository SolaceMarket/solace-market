import { Check, Mail, X } from "lucide-react";
import { useState } from "react";
import type { SecuritySettings } from "@/data/securityData";

interface EmailVerificationProps {
  settings: SecuritySettings;
  onSettingsChange: (settings: SecuritySettings) => void;
}

export function EmailVerification({
  settings,
  onSettingsChange,
}: EmailVerificationProps) {
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailVerification = async () => {
    if (!emailInput) {
      alert("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to send verification email
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowOTPInput(true);
      alert("Verification code sent to your email!");
    } catch (_error) {
      alert("Failed to send verification email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (otpCode.length !== 6) {
      alert("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSettingsChange({
        ...settings,
        emailVerified: true,
        email: emailInput,
      });
      setShowEmailSetup(false);
      setShowOTPInput(false);
      setEmailInput("");
      setOtpCode("");
      alert("Email verified successfully!");
    } catch (_error) {
      alert("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold flex items-center">
          <Mail className="w-5 h-5 mr-2 text-blue-400" />
          Email Verification
        </h3>
        {settings.emailVerified ? (
          <span className="flex items-center text-emerald-400 text-sm">
            <Check className="w-4 h-4 mr-1" />
            Verified
          </span>
        ) : (
          <span className="flex items-center text-red-400 text-sm">
            <X className="w-4 h-4 mr-1" />
            Not Verified
          </span>
        )}
      </div>

      {settings.emailVerified ? (
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
          <p className="text-gray-300 text-sm mb-1">Verified Email</p>
          <p className="text-white text-sm">{settings.email}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-400 text-sm">
            Verify your email to enable notifications and account recovery.
          </p>
          {!showEmailSetup ? (
            <button
              type="button"
              onClick={() => setShowEmailSetup(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Add Email Address
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              {showOTPInput && (
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit verification code"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              )}
              <div className="flex space-x-2">
                {!showOTPInput ? (
                  <>
                    <button
                      type="button"
                      onClick={handleEmailVerification}
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      {isLoading ? "Sending..." : "Send Code"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEmailSetup(false)}
                      className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleOTPVerification}
                    disabled={isLoading || otpCode.length !== 6}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
