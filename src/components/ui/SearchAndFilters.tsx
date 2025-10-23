import { useState } from "react";
import type { AssetFilters } from "@/data/assetFiltering";

interface SearchAndFiltersProps {
  exchanges: string[];
  classes: string[];
  onFiltersChange: (filters: AssetFilters) => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  currentFilters: AssetFilters;
}

export function SearchAndFilters({
  exchanges,
  classes,
  onFiltersChange,
  onSortChange,
  currentFilters,
}: SearchAndFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleFilterChange = (
    key: keyof AssetFilters,
    value: string | boolean | undefined,
  ) => {
    const newFilters = { ...currentFilters, [key]: value };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(currentFilters).some(
    (key) =>
      currentFilters[key as keyof AssetFilters] !== undefined &&
      currentFilters[key as keyof AssetFilters] !== "",
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search assets
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-label="Search"
              >
                <title>Search</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search by symbol or name..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={currentFilters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2">
          <select
            className="block px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-");
              onSortChange(sortBy, sortOrder as "asc" | "desc");
            }}
          >
            <option value="symbol-asc">Symbol A-Z</option>
            <option value="symbol-desc">Symbol Z-A</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="exchange-asc">Exchange A-Z</option>
            <option value="class-asc">Class A-Z</option>
          </select>

          <button
            type="button"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`px-4 py-2 border rounded-md font-medium transition-colors ${
              hasActiveFilters
                ? "border-blue-500 text-blue-700 bg-blue-50"
                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            Filters {hasActiveFilters && "•"}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {isFiltersOpen && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Exchange Filter */}
            <div>
              <label
                htmlFor="exchange-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Exchange
              </label>
              <select
                id="exchange-filter"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={currentFilters.exchange || ""}
                onChange={(e) =>
                  handleFilterChange("exchange", e.target.value || undefined)
                }
              >
                <option value="">All Exchanges</option>
                {exchanges.map((exchange) => (
                  <option key={exchange} value={exchange}>
                    {exchange}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Filter */}
            <div>
              <label
                htmlFor="class-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Asset Class
              </label>
              <select
                id="class-filter"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={currentFilters.class || ""}
                onChange={(e) =>
                  handleFilterChange("class", e.target.value || undefined)
                }
              >
                <option value="">All Classes</option>
                {classes.map((assetClass) => (
                  <option key={assetClass} value={assetClass}>
                    {assetClass}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status-filter"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={currentFilters.status || ""}
                onChange={(e) =>
                  handleFilterChange("status", e.target.value || undefined)
                }
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Trading Features */}
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Features
              </span>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={currentFilters.tradable === true}
                    onChange={(e) =>
                      handleFilterChange(
                        "tradable",
                        e.target.checked ? true : undefined,
                      )
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">Tradable</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={currentFilters.marginable === true}
                    onChange={(e) =>
                      handleFilterChange(
                        "marginable",
                        e.target.checked ? true : undefined,
                      )
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">Marginable</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={currentFilters.shortable === true}
                    onChange={(e) =>
                      handleFilterChange(
                        "shortable",
                        e.target.checked ? true : undefined,
                      )
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">Shortable</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={currentFilters.fractionable === true}
                    onChange={(e) =>
                      handleFilterChange(
                        "fractionable",
                        e.target.checked ? true : undefined,
                      )
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Fractionable
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
