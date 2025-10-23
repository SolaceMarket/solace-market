"use client";

import { useState } from "react";
import { queryHistory, type QueryHistoryEntry } from "../queryHistory";

interface QueryHistoryProps {
  history: QueryHistoryEntry[];
  onQuerySelect: (query: string) => void;
  onHistoryUpdate: (history: QueryHistoryEntry[]) => void;
}

export function QueryHistory({
  history,
  onQuerySelect,
  onHistoryUpdate,
}: QueryHistoryProps) {
  const [showHistory, setShowHistory] = useState(false);

  const handleClearHistory = () => {
    queryHistory.clearHistory();
    onHistoryUpdate([]);
  };

  const handleToggleFavorite = (entryId: string) => {
    queryHistory.toggleFavorite(entryId);
    onHistoryUpdate(queryHistory.getHistory());
  };

  return (
    <div className="bg-gray-800 p-4 border-b border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">Query History</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-gray-400 hover:text-white"
          >
            {showHistory ? "Hide" : "Show"} ({history.length})
          </button>
          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {showHistory && (
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {history.slice(0, 10).map((entry) => (
            <QueryHistoryItem
              key={entry.id}
              entry={entry}
              onQuerySelect={onQuerySelect}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}

          {history.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-4">
              No queries in history yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface QueryHistoryItemProps {
  entry: QueryHistoryEntry;
  onQuerySelect: (query: string) => void;
  onToggleFavorite: (entryId: string) => void;
}

function QueryHistoryItem({
  entry,
  onQuerySelect,
  onToggleFavorite,
}: QueryHistoryItemProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-700 rounded text-sm">
      <button
        type="button"
        onClick={() => onQuerySelect(entry.query)}
        className="flex-1 text-left text-gray-300 hover:text-white truncate font-mono text-xs"
        title={entry.query}
      >
        {entry.query}
      </button>

      <div className="flex items-center gap-1 flex-shrink-0">
        <span
          className={`text-xs ${entry.success ? "text-green-400" : "text-red-400"}`}
        >
          {entry.success ? "✓" : "✗"}
        </span>
        <span className="text-xs text-gray-500">{entry.executionTime}ms</span>
        <button
          type="button"
          onClick={() => onToggleFavorite(entry.id)}
          className={`text-xs hover:scale-110 transition-transform ${
            entry.favorite
              ? "text-yellow-400"
              : "text-gray-500 hover:text-yellow-400"
          }`}
          title={entry.favorite ? "Remove from favorites" : "Add to favorites"}
        >
          ★
        </button>
      </div>
    </div>
  );
}
