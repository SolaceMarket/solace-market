import { Eye, EyeOff, Key } from "lucide-react";
import { useState } from "react";
import type { SecuritySettings } from "@/data/securityData";

interface PasswordManagementProps {
  settings: SecuritySettings;
  onSettingsChange: (settings: SecuritySettings) => void;
}

export function PasswordManagement({
  settings,
  onSettingsChange,
}: PasswordManagementProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate password change
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onSettingsChange({
        ...settings,
        lastPasswordChange: new Date().toLocaleDateString(),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password changed successfully!");
    } catch (_error) {
      alert("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
      <h3 className="text-white font-semibold mb-3 flex items-center">
        <Key className="w-5 h-5 mr-2 text-yellow-400" />
        Password Management
      </h3>

      <div className="space-y-4">
        <div className="bg-slate-700/30 rounded-lg p-3">
          <p className="text-gray-400 text-xs">Last Password Change</p>
          <p className="text-white text-sm">{settings.lastPasswordChange}</p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
            >
              {passwordVisible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min. 8 characters)"
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
          />

          <button
            type="button"
            onClick={handlePasswordChange}
            disabled={isLoading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {isLoading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
