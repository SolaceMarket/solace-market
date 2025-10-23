"use client";

import {
  UNIVERSAL_QUERIES,
  PROJECT_QUERIES,
  type CommonQueryKey,
} from "../common-queries";

interface CommonQueriesProps {
  onQuerySelect: (queryName: string) => void;
}

export function CommonQueries({ onQuerySelect }: CommonQueriesProps) {
  return (
    <div className="bg-gray-800 p-4 border-b border-gray-700">
      <h3 className="font-bold mb-3">Common Queries</h3>

      {/* Universal Database Queries */}
      <QuerySection
        title="Universal (SQLite)"
        titleColor="text-blue-400"
        queries={UNIVERSAL_QUERIES}
        buttonColor="bg-blue-600 hover:bg-blue-500"
        onQuerySelect={onQuerySelect}
      />

      {/* Project-Specific Queries */}
      <QuerySection
        title="Project Specific"
        titleColor="text-green-400"
        queries={PROJECT_QUERIES}
        buttonColor="bg-green-600 hover:bg-green-500"
        onQuerySelect={onQuerySelect}
      />
    </div>
  );
}

interface QuerySectionProps {
  title: string;
  titleColor: string;
  queries: Record<string, string>;
  buttonColor: string;
  onQuerySelect: (queryName: string) => void;
}

function QuerySection({
  title,
  titleColor,
  queries,
  buttonColor,
  onQuerySelect,
}: QuerySectionProps) {
  return (
    <div className="mb-4 last:mb-0">
      <h4 className={`text-sm font-semibold ${titleColor} mb-2`}>{title}</h4>
      <div className="flex flex-wrap gap-2">
        {Object.keys(queries).map((queryName) => (
          <button
            key={queryName}
            type="button"
            onClick={() => onQuerySelect(queryName)}
            className={`${buttonColor} px-3 py-1 rounded text-xs transition-colors`}
          >
            {queryName}
          </button>
        ))}
      </div>
    </div>
  );
}
