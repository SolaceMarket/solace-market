"use client";

import { useState, useEffect, useCallback } from "react";
import type { QueryResult } from "../database-actions";
import { RowDetailSidebar } from "./RowDetailSidebar";

interface QueryResultsProps {
  queryResult: QueryResult;
}

export function QueryResults({ queryResult }: QueryResultsProps) {
  // Create a unique key for this query result to ensure we only restore sidebar for the same query
  const queryKey = JSON.stringify({
    columns: queryResult.columns,
    rowCount: queryResult.rows.length,
    executionTime: queryResult.executionTime,
  });

  // Initialize selectedRow from sessionStorage if available and matches current query
  const [selectedRow, setSelectedRow] = useState<Record<
    string,
    unknown
  > | null>(() => {
    try {
      const savedRow = sessionStorage.getItem("db_console_selected_row");
      const savedQueryKey = sessionStorage.getItem(
        "db_console_selected_row_query_key",
      );

      if (savedRow && savedQueryKey === queryKey) {
        return JSON.parse(savedRow);
      }
    } catch {
      // If parsing fails, return null
    }
    return null;
  });

  // Enhanced setSelectedRow to also save to sessionStorage
  const setSelectedRowWithPersistence = useCallback(
    (row: Record<string, unknown> | null) => {
      setSelectedRow(row);
      if (row) {
        sessionStorage.setItem("db_console_selected_row", JSON.stringify(row));
        sessionStorage.setItem("db_console_selected_row_query_key", queryKey);
      } else {
        sessionStorage.removeItem("db_console_selected_row");
        sessionStorage.removeItem("db_console_selected_row_query_key");
      }
    },
    [queryKey],
  );

  // Clear selected row when component unmounts or query changes
  useEffect(() => {
    // Update the query key in sessionStorage when query changes
    const savedQueryKey = sessionStorage.getItem(
      "db_console_selected_row_query_key",
    );
    if (savedQueryKey && savedQueryKey !== queryKey) {
      // Query has changed, clear the selected row
      sessionStorage.removeItem("db_console_selected_row");
      sessionStorage.removeItem("db_console_selected_row_query_key");
      setSelectedRow(null);
    }
  }, [queryKey]);

  return (
    <>
      <div className="bg-gray-900 rounded-lg border border-gray-700">
        {/* Header - always visible */}
        <div className="p-4 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Results</h3>
            <div className="text-xs text-gray-400">
              {queryResult.error ? "Error" : `${queryResult.rows.length} rows`}{" "}
              • {queryResult.executionTime}ms
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          {queryResult.error ? (
            <div className="p-4">
              <ErrorDisplay error={queryResult.error} />
            </div>
          ) : (
            <ResultsTable
              columns={queryResult.columns}
              rows={queryResult.rows}
              onRowClick={setSelectedRowWithPersistence}
            />
          )}
        </div>
      </div>

      {selectedRow && (
        <RowDetailSidebar
          isOpen={!!selectedRow}
          rowData={selectedRow}
          onClose={() => setSelectedRowWithPersistence(null)}
        />
      )}
    </>
  );
}

interface ErrorDisplayProps {
  error: string;
}

function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="bg-red-900 border border-red-600 p-3 rounded">
      <strong>Error:</strong> {error}
    </div>
  );
}

interface ResultsTableProps {
  columns: string[];
  rows: Record<string, unknown>[];
  onRowClick: (row: Record<string, unknown>) => void;
}

function ResultsTable({ columns, rows, onRowClick }: ResultsTableProps) {
  if (rows.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-gray-800 rounded p-4">
          <div className="text-center text-gray-500">No results returned</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-gray-700 overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-600 bg-gray-700 sticky top-0 z-10">
            {columns.map((col) => (
              <th
                key={col}
                className="p-3 text-left font-semibold text-gray-300 bg-gray-700"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            // Create a more stable key using multiple properties
            const rowKey = `${idx}-${Object.values(row).slice(0, 3).join("-").slice(0, 20)}`;
            return (
              <TableRow
                key={rowKey}
                row={row}
                columns={columns}
                rowKey={rowKey}
                rowIndex={idx}
                onRowClick={onRowClick}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface TableRowProps {
  row: Record<string, unknown>;
  columns: string[];
  rowKey: string;
  rowIndex: number;
  onRowClick: (row: Record<string, unknown>) => void;
}

function TableRow({
  row,
  columns,
  rowKey,
  rowIndex,
  onRowClick,
}: TableRowProps) {
  // Alternating row background colors - odd rows always have different background
  const baseRowClass = rowIndex % 2 === 0 ? "bg-gray-800" : "bg-gray-700";
  // Same hover color for both even and odd rows
  const rowHoverClass = "hover:bg-gray-600";

  return (
    <tr
      className={`border-b border-gray-600 ${baseRowClass} ${rowHoverClass} transition-colors cursor-pointer`}
      onClick={() => onRowClick(row)}
    >
      {columns.map((col) => (
        <TableCell key={`${rowKey}-${col}`} value={row[col]} />
      ))}
    </tr>
  );
}

interface TableCellProps {
  value: unknown;
}

function TableCell({ value }: TableCellProps) {
  const stringValue = String(value ?? "");
  const displayValue =
    stringValue.length > 100
      ? stringValue.substring(0, 100) + "..."
      : stringValue;

  return (
    <td
      className="p-3 text-gray-300 border-r border-gray-600 last:border-r-0 hover:bg-gray-500 hover:text-white transition-colors"
      title={stringValue.length > 100 ? stringValue : undefined}
    >
      {displayValue}
    </td>
  );
}
