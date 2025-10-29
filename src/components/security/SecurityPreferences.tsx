import { Lock } from "lucide-react";
import type { SecuritySettings } from "@/data/securityData";

interface SecurityPreferencesProps {
  settings: SecuritySettings;
  onSettingsChange: (settings: SecuritySettings) => void;
}

export function SecurityPreferences({
  settings,
  onSettingsChange,
}: SecurityPreferencesProps) {
  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
      <h3 className="text-white font-semibold mb-3 flex items-center">
        <Lock className="w-5 h-5 mr-2 text-purple-400" />
        Security Preferences
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm">Login Notifications</p>
            <p className="text-gray-400 text-xs">
              Get notified of new device logins
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onSettingsChange({
                ...settings,
                loginNotifications: !settings.loginNotifications,
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.loginNotifications ? "bg-emerald-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.loginNotifications ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm">Trust This Device</p>
            <p className="text-gray-400 text-xs">
              Remember this device for 30 days
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onSettingsChange({
                ...settings,
                deviceTrust: !settings.deviceTrust,
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.deviceTrust ? "bg-emerald-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.deviceTrust ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm">Session Timeout</p>
            <p className="text-gray-400 text-xs">
              Auto-logout after inactivity
            </p>
          </div>
          <select
            value={settings.sessionTimeout}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                sessionTimeout: parseInt(e.target.value),
              })
            }
            className="bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-purple-500"
          >
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
          </select>
        </div>
      </div>
    </div>
  );
}
