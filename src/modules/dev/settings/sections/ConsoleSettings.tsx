"use client";

import { useSettings } from "../index";

export function ConsoleSettings() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">
          Default Tab
        </label>
        <select
          value={settings.console.defaultTab}
          onChange={(e) =>
            updateSetting({
              path: "console.defaultTab",
              value: e.target.value,
            })
          }
          className="bg-gray-700 p-2 rounded w-full"
        >
          <option value="tables">Tables</option>
          <option value="query">Query</option>
          <option value="stats">Stats</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.console.autoOpen}
            onChange={(e) =>
              updateSetting({
                path: "console.autoOpen",
                value: e.target.checked,
              })
            }
          />
          <span>Auto-open console on page load</span>
        </label>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.console.directCommandPalette}
            onChange={(e) =>
              updateSetting({
                path: "console.directCommandPalette",
                value: e.target.checked,
              })
            }
          />
          <span>Open command palette directly with Ctrl+M</span>
        </label>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.console.theme.terminalMode}
            onChange={(e) =>
              updateSetting({
                path: "console.theme.terminalMode",
                value: e.target.checked,
              })
            }
          />
          <span>Terminal mode (dark theme)</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Font Size
        </label>
        <select
          value={settings.console.theme.fontSize}
          onChange={(e) =>
            updateSetting({
              path: "console.theme.fontSize",
              value: e.target.value,
            })
          }
          className="bg-gray-700 p-2 rounded w-full"
        >
          <option value="xs">Extra Small</option>
          <option value="sm">Small</option>
          <option value="base">Base</option>
          <option value="lg">Large</option>
        </select>
      </div>
    </div>
  );
}