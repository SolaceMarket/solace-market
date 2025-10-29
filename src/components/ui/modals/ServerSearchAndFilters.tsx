import type { AssetFilters } from "@/data/assetFiltering";

interface ServerSearchAndFiltersProps {
  exchanges: string[];
  classes: string[];
  currentFilters: AssetFilters;
  currentSort: {
    sortBy: "symbol" | "name" | "exchange" | "class";
    sortOrder: "asc" | "desc";
  };
}

export function ServerSearchAndFilters({
  exchanges,
  classes,
  currentFilters,
  currentSort,
}: ServerSearchAndFiltersProps) {
  const hasActiveFilters = Object.keys(currentFilters).some(
    (key) =>
      currentFilters[key as keyof AssetFilters] !== undefined &&
      currentFilters[key as keyof AssetFilters] !== "",
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form method="GET" className="space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search assets
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                defaultValue={currentFilters.search || ""}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by symbol or name..."
              />
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <select
              name="sortBy"
              defaultValue={currentSort.sortBy}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="symbol">Symbol</option>
              <option value="name">Name</option>
              <option value="exchange">Exchange</option>
              <option value="class">Class</option>
            </select>

            <select
              name="sortOrder"
              defaultValue={currentSort.sortOrder}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>

        {/* Filters Section */}
        <details className="mt-4">
          <summary className="cursor-pointer flex items-center justify-between py-2 text-sm font-medium text-gray-900 hover:text-blue-600">
            <span className="flex items-center">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                />
              </svg>
              Advanced Filters
              {hasActiveFilters && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Active
                </span>
              )}
            </span>
          </summary>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Exchange Filter */}
            <div>
              <label
                htmlFor="exchange"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Exchange
              </label>
              <select
                name="exchange"
                id="exchange"
                defaultValue={currentFilters.exchange || ""}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                htmlFor="class"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Asset Class
              </label>
              <select
                name="class"
                id="class"
                defaultValue={currentFilters.class || ""}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Classes</option>
                {classes.map((assetClass) => (
                  <option key={assetClass} value={assetClass}>
                    {assetClass}
                  </option>
                ))}
              </select>
            </div>

            {/* Boolean Filters */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Trading Features
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="tradable"
                      value="true"
                      defaultChecked={currentFilters.tradable || false}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tradable</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="marginable"
                      value="true"
                      defaultChecked={currentFilters.marginable || false}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Marginable
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="shortable"
                      value="true"
                      defaultChecked={currentFilters.shortable || false}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Shortable
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="fractionable"
                      value="true"
                      defaultChecked={currentFilters.fractionable || false}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Fractionable
                    </span>
                  </label>
                </div>
              </fieldset>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <a
                href="/assets"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear All Filters
              </a>
            </div>
          )}
        </details>
      </form>
    </div>
  );
}
