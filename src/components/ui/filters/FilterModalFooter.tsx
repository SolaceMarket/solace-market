import type { FilterOptions } from "./types";

interface FilterModalFooterProps {
  filters: FilterOptions;
  onClearAll: () => void;
  onCancel: () => void;
  onApply: () => void;
}

export function FilterModalFooter({
  filters,
  onClearAll,
  onCancel,
  onApply,
}: FilterModalFooterProps) {
  const getActiveFilterCount = () => {
    return Object.values(filters).filter(
      (value) => value !== undefined && value !== "" && value !== null,
    ).length;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="flex items-center justify-between p-6 border-t border-slate-700">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onClearAll}
          className="text-gray-400 hover:text-white transition-colors"
        >
          Clear All
        </button>
        {activeFilterCount > 0 && (
          <span className="text-sm text-gray-400">
            {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}{" "}
            active
          </span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onApply}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
