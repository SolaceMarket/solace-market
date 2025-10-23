"use client";

import { useState, useTransition, useEffect } from "react";
import { getTableInfo, getTableSample } from "./database-actions";
import type { TableInfo, DatabaseStats } from "./database-actions";
import { TableDetailsView } from "./tables";
import { VerticalTableSidebar } from "./VerticalTableSidebar";
import { useSettings } from "./settings";

interface SimpleTablesTabProps {
  tables: string[];
  stats: DatabaseStats | null;
  selectedTableFromCommand?: string | null;
  onTableCommandHandled?: () => void;
}

export function SimpleTablesTab({ tables, stats, selectedTableFromCommand, onTableCommandHandled }: SimpleTablesTabProps) {
  const { settings, getSetting } = useSettings();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [sampleData, setSampleData] = useState<Record<string, unknown>[]>([]);
  const [isPending, startTransition] = useTransition();

  // Get navigation mode from settings - access directly from settings to ensure reactivity
  const navigationMode = (settings.tables?.navigation?.mode as string) || "quickSwitch";
  const verticalSidebarWidth = (settings.tables?.navigation?.verticalSidebarWidth as number) || 200;

  const loadTableDetails = (tableName: string) => {
    startTransition(async () => {
      try {
        const sampleLimit = settings.tables.sampleData.defaultLimit;
        const [info, sample] = await Promise.all([
          getTableInfo(tableName),
          getTableSample(tableName, sampleLimit),
        ]);
        setTableInfo(info);
        setSampleData(sample);
        setSelectedTable(tableName);
      } catch (error) {
        console.error("Error loading table details:", error);
      }
    });
  };

  // Handle table selection from command palette
  useEffect(() => {
    if (selectedTableFromCommand && tables.includes(selectedTableFromCommand)) {
      loadTableDetails(selectedTableFromCommand);
      onTableCommandHandled?.();
    }
  }, [selectedTableFromCommand, tables, onTableCommandHandled]);

  // If no table selected, show the table list
  if (!selectedTable) {
    return (
      <div className="w-full p-6 overflow-y-auto">
        <div className="mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-green-400 mb-2">
              Database Tables
            </h2>
            <p className="text-gray-400">
              Select a table to view its schema, sample data, and structure.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => {
              // Get table stats for additional information
              const tableStats = stats?.tables.find(t => t.name === table);
              const rowCount = tableStats?.rowCount || 0;
              const columnCount = tableStats?.columnCount || 0;
              
              // Determine table size category for visual indicator
              const getSizeIndicator = (rows: number) => {
                if (rows === 0) return { icon: "📄", color: "text-gray-500", label: "Empty" };
                if (rows < 100) return { icon: "📄", color: "text-blue-400", label: "Small" };
                if (rows < 10000) return { icon: "📊", color: "text-green-400", label: "Medium" };
                return { icon: "🗃️", color: "text-orange-400", label: "Large" };
              };
              
              const sizeInfo = getSizeIndicator(rowCount);
              
              return (
                <button
                  key={table}
                  type="button"
                  onClick={() => loadTableDetails(table)}
                  className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-green-500/50 rounded-lg text-left transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xl ${sizeInfo.color}`}>{sizeInfo.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-green-300 group-hover:text-green-200 truncate">
                        {table}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${sizeInfo.color} bg-opacity-20`}>
                          {sizeInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Table Statistics */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Rows:</span>
                      <span className="font-medium text-gray-300">
                        {tableStats ? rowCount.toLocaleString() : "..."}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Columns:</span>
                      <span className="font-medium text-gray-300">
                        {tableStats ? columnCount : "..."}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 group-hover:text-gray-300">
                    Click to view schema and sample data
                  </p>
                </button>
              );
            })}
          </div>

          {tables.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">📋</div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Tables Found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Your database doesn't contain any tables yet. Use the Admin tab
                to initialize tables or create them manually.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show table details based on navigation mode
  if (navigationMode === "verticalSidebar") {
    // Vertical sidebar mode - show sidebar and content side by side
    return (
      <div className="w-full h-full flex">
        <VerticalTableSidebar
          tables={tables}
          selectedTable={selectedTable}
          isPending={isPending}
          width={verticalSidebarWidth}
          onTableSelect={loadTableDetails}
        />
        <div className="flex-1 flex flex-col">
          {selectedTable ? (
            <>
              {/* Header for selected table */}
              <div className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  <h2 className="text-xl font-semibold text-green-300">
                    {selectedTable}
                  </h2>
                </div>
              </div>
              {/* Table details */}
              <div className="flex-1 overflow-scroll">
                {isPending ? (
                  <div className="w-full p-6 text-center">
                    <div className="text-lg">Loading table details...</div>
                  </div>
                ) : (
                  <TableDetailsView
                    selectedTable={selectedTable}
                    tableInfo={tableInfo}
                    sampleData={sampleData}
                  />
                )}
              </div>
            </>
          ) : (
            // No table selected - show instruction
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4 opacity-50">📋</div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Select a table to view details
                </h3>
                <p className="text-gray-500">
                  Choose a table from the sidebar to view its schema, sample
                  data, and structure.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Quick switch mode (original behavior)
  return (
    <div className="w-full flex flex-col">
      {/* Header with back button and quick navigation */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center gap-4 mb-3">
          <button
            type="button"
            onClick={() => {
              setSelectedTable(null);
              setTableInfo(null);
              setSampleData([]);
            }}
            className="bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded flex items-center gap-2 text-sm"
          >
            ← Back to Tables
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h2 className="text-xl font-semibold text-green-300">
              {selectedTable}
            </h2>
          </div>
        </div>

        {/* Quick Navigation - Table Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 whitespace-nowrap">
            Quick switch:
          </span>
          <div className="flex flex-wrap gap-1 overflow-x-auto">
            {tables.map((table) => (
              <button
                key={table}
                type="button"
                onClick={() => loadTableDetails(table)}
                disabled={isPending}
                className={`px-2 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                  table === selectedTable
                    ? "bg-green-600 text-green-100"
                    : "bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-white disabled:opacity-50"
                }`}
                title={`Switch to ${table} table`}
              >
                {table}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table details */}
      <div className="flex-1 overflow-scroll">
        {isPending ? (
          <div className="w-full p-6 text-center">
            <div className="text-lg">Loading table details...</div>
          </div>
        ) : (
          <TableDetailsView
            selectedTable={selectedTable}
            tableInfo={tableInfo}
            sampleData={sampleData}
          />
        )}
      </div>
    </div>
  );
}
