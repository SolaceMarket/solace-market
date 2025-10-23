"use client";

import { useSettings } from "../index";

export function QuerySettings() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.query.execution.showExecutionTime}
            onChange={(e) =>
              updateSetting({
                path: "query.execution.showExecutionTime",
                value: e.target.checked,
              })
            }
          />
          <span>Show query execution time</span>
        </label>
      </div>

      <div>
        <label
          htmlFor="max-results"
          className="block text-sm font-semibold mb-2"
        >
          Max Results
        </label>
        <input
          id="max-results"
          type="number"
          min="10"
          max="10000"
          value={settings.query.execution.maxResults}
          onChange={(e) =>
            updateSetting({
              path: "query.execution.maxResults",
              value: parseInt(e.target.value),
            })
          }
          className="bg-gray-700 p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.query.history.enabled}
            onChange={(e) =>
              updateSetting({
                path: "query.history.enabled",
                value: e.target.checked,
              })
            }
          />
          <span>Enable query history</span>
        </label>
      </div>
    </div>
  );
}