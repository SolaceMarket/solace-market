"use client";

interface QueryInputProps {
  sqlQuery: string;
  isPending: boolean;
  onQueryChange: (query: string) => void;
  onExecute: () => void;
}

export function QueryInput({
  sqlQuery,
  isPending,
  onQueryChange,
  onExecute,
}: QueryInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onExecute();
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">SQL Query</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Ctrl+Enter to execute</span>
          <button
            type="button"
            onClick={onExecute}
            disabled={isPending || !sqlQuery.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded transition-colors"
          >
            {isPending ? "Executing..." : "Execute"}
          </button>
        </div>
      </div>
      <textarea
        value={sqlQuery}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-32 bg-gray-800 p-3 rounded resize-none font-mono border border-gray-700 focus:border-gray-600 focus:outline-none"
        placeholder="Enter your SQL query here... (Ctrl+Enter to execute)"
      />
    </div>
  );
}
