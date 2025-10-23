"use client";

import { useTransition } from "react";
import { initializeTables } from "./database-actions";

interface AdminTabProps {
  onRefreshData: () => void;
  onTabChange: (tab: string) => void;
  setSqlQuery: (query: string) => void;
}

export function AdminTab({
  onRefreshData,
  onTabChange,
  setSqlQuery,
}: AdminTabProps) {
  const [isPending, startTransition] = useTransition();

  const handleInitializeTables = () => {
    startTransition(async () => {
      try {
        const result = await initializeTables();
        if (result.success) {
          onRefreshData();
          alert("Database tables initialized successfully!");
        } else {
          alert(`Error initializing tables: ${result.error}`);
        }
      } catch (error) {
        console.error("Error initializing tables:", error);
        alert("Error initializing tables");
      }
    });
  };

  const handlePragmaQuery = (query: string) => {
    setSqlQuery(query);
    onTabChange("query");
  };

  return (
    <div className="w-full p-4">
      <h3 className="font-bold text-lg mb-4">Database Administration</h3>

      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h4 className="font-semibold mb-2">Table Management</h4>
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleInitializeTables}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded mr-2"
            >
              {isPending ? "Initializing..." : "Initialize All Tables"}
            </button>
            <button
              type="button"
              onClick={onRefreshData}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Refresh Data
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h4 className="font-semibold mb-2">Development Tools</h4>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handlePragmaQuery("PRAGMA table_list;")}
              className="block bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left w-full"
            >
              Show All Tables (PRAGMA)
            </button>
            <button
              type="button"
              onClick={() =>
                handlePragmaQuery(
                  'SELECT sql FROM sqlite_schema WHERE type = "table";',
                )
              }
              className="block bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left w-full"
            >
              Show All CREATE Statements
            </button>
            <button
              type="button"
              onClick={() => handlePragmaQuery("PRAGMA foreign_key_list;")}
              className="block bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left w-full"
            >
              Show Foreign Keys
            </button>
            <button
              type="button"
              onClick={() => handlePragmaQuery("PRAGMA index_list;")}
              className="block bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left w-full"
            >
              Show Indexes
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h4 className="font-semibold mb-2">Database Optimization</h4>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handlePragmaQuery("PRAGMA optimize;")}
              className="block bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left w-full"
            >
              Optimize Database
            </button>
            <button
              type="button"
              onClick={() => handlePragmaQuery("PRAGMA integrity_check;")}
              className="block bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left w-full"
            >
              Integrity Check
            </button>
            <button
              type="button"
              onClick={() =>
                handlePragmaQuery(
                  "PRAGMA analysis_limit=1000; PRAGMA optimize;",
                )
              }
              className="block bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left w-full"
            >
              Analyze & Optimize
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h4 className="font-semibold mb-2">Quick Actions</h4>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() =>
                handlePragmaQuery("SELECT COUNT(*) as user_count FROM users;")
              }
              className="block bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left w-full"
            >
              Count Users
            </button>
            <button
              type="button"
              onClick={() =>
                handlePragmaQuery("SELECT COUNT(*) as asset_count FROM assets;")
              }
              className="block bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left w-full"
            >
              Count Assets
            </button>
            <button
              type="button"
              onClick={() =>
                handlePragmaQuery(
                  "SELECT COUNT(*) as portfolio_count FROM portfolios;",
                )
              }
              className="block bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left w-full"
            >
              Count Portfolios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
