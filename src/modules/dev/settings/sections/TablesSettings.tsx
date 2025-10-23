"use client";

import { useSettings } from "../index";
import type { SidebarMode } from "../../tables/types";

export function TablesSettings() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">
          Default Sidebar Mode
        </label>
        <select
          value={settings.tables.sidebar.defaultMode}
          onChange={(e) =>
            updateSetting({
              path: "tables.sidebar.defaultMode",
              value: e.target.value as SidebarMode,
            })
          }
          className="bg-gray-700 p-2 rounded w-full"
        >
          <option value="always-open">Always Open</option>
          <option value="auto-collapse">Auto Collapse</option>
          <option value="manual-collapse">Manual</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Table Navigation Mode
        </label>
        <select
          value={settings.tables.navigation.mode}
          onChange={(e) =>
            updateSetting({
              path: "tables.navigation.mode",
              value: e.target.value,
            })
          }
          className="bg-gray-700 p-2 rounded w-full"
        >
          <option value="quickSwitch">Quick Switch Buttons</option>
          <option value="verticalSidebar">Vertical Sidebar</option>
        </select>
        <p className="text-xs text-gray-400 mt-1">
          Quick Switch: Show table navigation as horizontal buttons in
          header
          <br />
          Vertical Sidebar: Show table list as a vertical sidebar between
          main navigation and content
        </p>
      </div>

      {settings.tables.navigation.mode === "verticalSidebar" && (
        <div>
          <label
            htmlFor="vertical-sidebar-width"
            className="block text-sm font-semibold mb-2"
          >
            Vertical Sidebar Width
          </label>
          <input
            id="vertical-sidebar-width"
            type="number"
            min="150"
            max="400"
            value={settings.tables.navigation.verticalSidebarWidth}
            onChange={(e) =>
              updateSetting({
                path: "tables.navigation.verticalSidebarWidth",
                value: parseInt(e.target.value),
              })
            }
            className="bg-gray-700 p-2 rounded w-full"
          />
          <p className="text-xs text-gray-400 mt-1">
            Width of the vertical table navigation sidebar in pixels
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="sample-data-limit"
          className="block text-sm font-semibold mb-2"
        >
          Sample Data Limit
        </label>
        <input
          id="sample-data-limit"
          type="number"
          min="1"
          max="100"
          value={settings.tables.sampleData.defaultLimit}
          onChange={(e) =>
            updateSetting({
              path: "tables.sampleData.defaultLimit",
              value: parseInt(e.target.value),
            })
          }
          className="bg-gray-700 p-2 rounded w-full"
        />
      </div>

      <div>
        <label
          htmlFor="max-cell-length"
          className="block text-sm font-semibold mb-2"
        >
          Max Cell Text Length
        </label>
        <input
          id="max-cell-length"
          type="number"
          min="10"
          max="500"
          value={settings.tables.sampleData.maxCellLength}
          onChange={(e) =>
            updateSetting({
              path: "tables.sampleData.maxCellLength",
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
            checked={settings.tables.sampleData.truncateText}
            onChange={(e) =>
              updateSetting({
                path: "tables.sampleData.truncateText",
                value: e.target.checked,
              })
            }
          />
          <span>Truncate long text in cells</span>
        </label>
      </div>
    </div>
  );
}