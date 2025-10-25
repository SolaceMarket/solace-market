import { useState, useEffect, memo } from "react";
import type { AssetsFiltersProps } from "../types";

function AssetsFilters({ filters, onFilterChange }: AssetsFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  // Update search input when filters change (e.g., from URL params)
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onFilterChange("search", value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label
            htmlFor="search-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Search (symbol, name, ID)
          </label>
          <div className="relative">
            <input
              id="search-input"
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search assets..."
            />
            {searchInput !== filters.search && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="class-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Asset Class
          </label>
          <select
            id="class-select"
            value={filters.class}
            onChange={(e) => onFilterChange("class", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Classes</option>
            <option value="us_equity">US Equity</option>
            <option value="crypto">Crypto</option>
            <option value="forex">Forex</option>
            <option value="commodity">Commodity</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="exchange-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Exchange
          </label>
          <select
            id="exchange-select"
            value={filters.exchange}
            onChange={(e) => onFilterChange("exchange", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Exchanges</option>
            <option value="NASDAQ">NASDAQ</option>
            <option value="NYSE">NYSE</option>
            <option value="ARCA">ARCA</option>
            <option value="OTC">OTC</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="status-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Status
          </label>
          <select
            id="status-select"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="delisted">Delisted</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="tradable-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tradability
          </label>
          <select
            id="tradable-select"
            value={filters.tradable}
            onChange={(e) => onFilterChange("tradable", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="true">Tradable</option>
            <option value="false">Non-tradable</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(AssetsFilters);
