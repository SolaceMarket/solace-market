"use client";

import type { SidebarMode } from "./types";

interface CollapsibleSidebarProps {
  tables: string[];
  selectedTable: string | null;
  isPending: boolean;
  sidebarMode: SidebarMode;
  isManuallyCollapsed: boolean;
  onTableSelect: (tableName: string) => void;
  onSidebarModeChange: (mode: SidebarMode) => void;
  onToggleSidebar: () => void;
  onExpandSidebar: () => void;
}

export function CollapsibleSidebar({
  tables,
  selectedTable,
  isPending,
  sidebarMode,
  isManuallyCollapsed,
  onTableSelect,
  onSidebarModeChange,
  onToggleSidebar,
  onExpandSidebar,
}: CollapsibleSidebarProps) {
  // Determine if sidebar should be collapsed
  const isSidebarCollapsed =
    (sidebarMode === "manual-collapse" && isManuallyCollapsed) ||
    (sidebarMode === "auto-collapse" && selectedTable && isManuallyCollapsed);

  return (
    <div className="flex flex-col bg-gray-800 border-r border-gray-700">
      {/* Sidebar Controls - Always visible when expanded */}
      {!isSidebarCollapsed && (
        <div className="bg-gray-700 p-2 border-b border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold">Sidebar:</span>
            <select
              value={sidebarMode}
              onChange={(e) =>
                onSidebarModeChange(e.target.value as SidebarMode)
              }
              className="bg-gray-600 text-xs px-2 py-1 rounded"
            >
              <option value="always-open">Always Open</option>
              <option value="auto-collapse">Auto Collapse</option>
              <option value="manual-collapse">Manual</option>
            </select>
          </div>

          {/* Manual Toggle Button - when expanded */}
          {sidebarMode === "manual-collapse" && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded"
              title="Collapse sidebar"
            >
              ← Collapse
            </button>
          )}
        </div>
      )}

      {/* Collapsed State - Only expand buttons */}
      {isSidebarCollapsed && (
        <div className="bg-gray-700 p-2 flex flex-col gap-2 min-w-[3rem]">
          {/* Manual expand button */}
          {sidebarMode === "manual-collapse" && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="bg-gray-600 hover:bg-gray-500 p-2 rounded flex items-center justify-center transition-colors"
              title="Expand sidebar"
            >
              <span className="text-lg">📋</span>
            </button>
          )}

          {/* Auto-collapse expand button */}
          {sidebarMode === "auto-collapse" && selectedTable && (
            <button
              type="button"
              onClick={onExpandSidebar}
              className="bg-blue-600 hover:bg-blue-500 p-2 rounded flex items-center justify-center transition-colors"
              title="Expand tables list"
            >
              <span className="text-lg">📋</span>
            </button>
          )}
        </div>
      )}

      {/* Table List - Only visible when not collapsed */}
      {!isSidebarCollapsed && (
        <div className="w-80 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📋</span>
            <h3 className="font-bold">Tables ({tables.length})</h3>
          </div>
          {isPending ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-1">
              {tables.map((table) => (
                <button
                  key={table}
                  type="button"
                  onClick={() => onTableSelect(table)}
                  className={`block w-full text-left p-2 rounded hover:bg-gray-700 ${
                    selectedTable === table ? "bg-gray-600" : ""
                  }`}
                >
                  {table}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
