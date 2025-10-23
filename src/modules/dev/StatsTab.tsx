"use client";

import type { DatabaseStats } from "./database-actions";

interface StatsTabProps {
  stats: DatabaseStats | null;
}

export function StatsTab({ stats }: StatsTabProps) {
  if (!stats) {
    return (
      <div className="w-full p-4">
        <h3 className="font-bold text-lg mb-4">Database Statistics</h3>
        <div>Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 overflow-y-auto">
      <h3 className="font-bold text-lg mb-4">Database Statistics</h3>

      <div className="space-y-6">
        {/* Overview */}
        <div className="bg-gray-800 p-4 rounded">
          <h4 className="font-semibold mb-2">Overview</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {stats.totalTables}
              </div>
              <div className="text-gray-400">Total Tables</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {stats.totalRows.toLocaleString()}
              </div>
              <div className="text-gray-400">Total Rows</div>
            </div>
          </div>
        </div>

        {/* Table Breakdown */}
        <div className="bg-gray-800 p-4 rounded">
          <h4 className="font-semibold mb-2">Tables</h4>
          <div className="space-y-2">
            {stats.tables.map((table) => (
              <div
                key={table.name}
                className="flex justify-between items-center"
              >
                <span>{table.name}</span>
                <div className="flex space-x-4">
                  <span className="text-gray-400">
                    {table.columnCount} cols
                  </span>
                  <span className="text-green-400">
                    {table.rowCount.toLocaleString()} rows
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-gray-800 p-4 rounded">
          <h4 className="font-semibold mb-2">Insights</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Largest table:</span>
              <span className="text-green-400">
                {
                  stats.tables.reduce((max, table) =>
                    table.rowCount > max.rowCount ? table : max,
                  ).name
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span>Most complex table:</span>
              <span className="text-green-400">
                {
                  stats.tables.reduce((max, table) =>
                    table.columnCount > max.columnCount ? table : max,
                  ).name
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span>Average rows per table:</span>
              <span className="text-green-400">
                {Math.round(
                  stats.totalRows / stats.totalTables,
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
