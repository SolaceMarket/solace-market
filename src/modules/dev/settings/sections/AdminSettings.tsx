"use client";

import { useSettings } from "../index";

export function AdminSettings() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={
              settings.admin.dangerousOperations.requireConfirmation
            }
            onChange={(e) =>
              updateSetting({
                path: "admin.dangerousOperations.requireConfirmation",
                value: e.target.checked,
              })
            }
          />
          <span>Require confirmation for dangerous operations</span>
        </label>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.admin.dangerousOperations.showWarnings}
            onChange={(e) =>
              updateSetting({
                path: "admin.dangerousOperations.showWarnings",
                value: e.target.checked,
              })
            }
          />
          <span>Show warnings for dangerous operations</span>
        </label>
      </div>
    </div>
  );
}