"use client";

import { useSettings } from "../index";

export function StatsSettings() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.stats.refresh.autoRefresh}
            onChange={(e) =>
              updateSetting({
                path: "stats.refresh.autoRefresh",
                value: e.target.checked,
              })
            }
          />
          <span>Auto-refresh stats</span>
        </label>
      </div>

      {settings.stats.refresh.autoRefresh && (
        <div>
          <label
            htmlFor="refresh-interval"
            className="block text-sm font-semibold mb-2"
          >
            Refresh Interval (seconds)
          </label>
          <input
            id="refresh-interval"
            type="number"
            min="5"
            max="300"
            value={settings.stats.refresh.interval / 1000}
            onChange={(e) =>
              updateSetting({
                path: "stats.refresh.interval",
                value: parseInt(e.target.value) * 1000,
              })
            }
            className="bg-gray-700 p-2 rounded w-full"
          />
        </div>
      )}
    </div>
  );
}