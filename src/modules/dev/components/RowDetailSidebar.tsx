"use client";

import { useEffect } from "react";

interface RowDetailSidebarProps {
  isOpen: boolean;
  rowData: Record<string, unknown> | null;
  onClose: () => void;
}

export function RowDetailSidebar({
  isOpen,
  rowData,
  onClose,
}: RowDetailSidebarProps) {
  // Handle Escape key to close sidebar only (with higher priority than console)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        // Stop the event from propagating to prevent console from closing
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
      }
    };

    if (isOpen) {
      // Use capture phase to handle the event before other handlers
      document.addEventListener("keydown", handleEscape, { capture: true });
      return () =>
        document.removeEventListener("keydown", handleEscape, {
          capture: true,
        });
    }
  }, [isOpen, onClose]);

  if (!isOpen || !rowData) return null;

  const entries = Object.entries(rowData);

  return (
    <>
      {/* Sidebar - fixed positioning from right edge */}
      <div
        className={`
        fixed top-0 right-0 h-full w-124 bg-gray-900 border-l border-gray-700 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="font-bold text-lg">Row Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Close</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-full pb-20">
          <div className="space-y-4">
            {entries.map(([key, value]) => (
              <RowDetailItem
                key={`field-${key}-${String(value)?.slice(0, 20) || "empty"}`}
                fieldName={key}
                fieldValue={value}
              />
            ))}
          </div>

          {entries.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No data to display
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            {entries.length} field{entries.length !== 1 ? "s" : ""} • Press ESC
            to close
          </div>
        </div>
      </div>
    </>
  );
}

interface RowDetailItemProps {
  fieldName: string;
  fieldValue: unknown;
}

function RowDetailItem({ fieldName, fieldValue }: RowDetailItemProps) {
  const stringValue = String(fieldValue ?? "");
  const isLongValue = stringValue.length > 100;
  const isJsonLike = stringValue.startsWith("{") || stringValue.startsWith("[");

  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-blue-400 text-sm">{fieldName}</h4>
        <ValueTypeIndicator value={fieldValue} />
      </div>

      <div className="text-gray-300">
        {stringValue === "" ? (
          <span className="text-gray-500 italic">empty</span>
        ) : stringValue === "null" || fieldValue === null ? (
          <span className="text-gray-500 italic">null</span>
        ) : isJsonLike ? (
          <JsonValueDisplay value={stringValue} />
        ) : isLongValue ? (
          <LongValueDisplay value={stringValue} />
        ) : (
          <span className="font-mono text-sm">{stringValue}</span>
        )}
      </div>
    </div>
  );
}

interface ValueTypeIndicatorProps {
  value: unknown;
}

function ValueTypeIndicator({ value }: ValueTypeIndicatorProps) {
  const getValueType = (val: unknown): { type: string; color: string } => {
    if (val === null) return { type: "null", color: "text-gray-500" };
    if (val === undefined) return { type: "undefined", color: "text-gray-500" };
    if (typeof val === "string") {
      if (val === "") return { type: "empty", color: "text-gray-500" };
      if (val.startsWith("{") || val.startsWith("["))
        return { type: "json", color: "text-purple-400" };
      if (!Number.isNaN(Date.parse(val)) && val.includes("-"))
        return { type: "date", color: "text-cyan-400" };
      return { type: "string", color: "text-green-400" };
    }
    if (typeof val === "number")
      return { type: "number", color: "text-yellow-400" };
    if (typeof val === "boolean")
      return { type: "boolean", color: "text-orange-400" };
    return { type: "object", color: "text-purple-400" };
  };

  const { type, color } = getValueType(value);

  return (
    <div className="flex gap-1">
      <span
        className={`text-xs px-2 py-1 rounded ${color} bg-opacity-20 bg-current`}
      />
      {type}
    </div>
  );
}

interface JsonValueDisplayProps {
  value: string;
}

function JsonValueDisplay({ value }: JsonValueDisplayProps) {
  try {
    const parsed = JSON.parse(value);
    const formatted = JSON.stringify(parsed, null, 2);

    return (
      <pre className="font-mono text-sm bg-gray-900 p-2 rounded overflow-x-auto whitespace-pre-wrap">
        {formatted}
      </pre>
    );
  } catch {
    return <span className="font-mono text-sm">{value}</span>;
  }
}

interface LongValueDisplayProps {
  value: string;
}

function LongValueDisplay({ value }: LongValueDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="font-mono text-sm bg-gray-900 p-2 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">
        {value}
      </div>
      <div className="text-xs text-gray-500">{value.length} characters</div>
    </div>
  );
}
