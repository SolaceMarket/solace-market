"use client";

import { ArrowUpDown, ChevronDown, Filter, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FilterOptions {
  exchange?: string;
  class?: string;
  tradable?: boolean;
  marginable?: boolean;
  shortable?: boolean;
  fractionable?: boolean;
  status?: string;
}

interface SortOptions {
  sortBy: "symbol" | "name" | "exchange" | "class";
  sortOrder: "asc" | "desc";
}

interface AssetFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions, sort: SortOptions) => void;
  exchanges: string[];
  classes: string[];
  currentFilters: FilterOptions;
  currentSort: SortOptions;
}

export function AssetFilterModal({
  isOpen,
  onClose,
  onApplyFilters,
  exchanges,
  classes,
  currentFilters,
  currentSort,
}: AssetFilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [sort, setSort] = useState<SortOptions>(currentSort);
  const [expandedSections, setExpandedSections] = useState({
    exchange: false,
    class: false,
    properties: false,
    sort: true,
  });

  // Reset filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters);
      setSort(currentSort);
    }
  }, [isOpen, currentFilters, currentSort]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = (
    key: keyof FilterOptions,
    value: string | boolean | undefined,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateSort = (key: keyof SortOptions, value: string) => {
    setSort((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({});
    setSort({ sortBy: "symbol", sortOrder: "asc" });
  };

  const applyFilters = () => {
    onApplyFilters(filters, sort);
    onClose();
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(
      (value) => value !== undefined && value !== "" && value !== null,
    ).length;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4">
      <div
        ref={modalRef}
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md mt-16 max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <Filter className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">
              Filter & Sort Assets
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-6">
          {/* Sort Section */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("sort")}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-medium text-white flex items-center space-x-2">
                <ArrowUpDown className="w-5 h-5 text-emerald-400" />
                <span>Sort</span>
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedSections.sort ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.sort && (
              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="sort-by"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Sort By
                  </label>
                  <select
                    id="sort-by"
                    value={sort.sortBy}
                    onChange={(e) => updateSort("sortBy", e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="symbol">Symbol</option>
                    <option value="name">Name</option>
                    <option value="exchange">Exchange</option>
                    <option value="class">Class</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sort-order"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Order
                  </label>
                  <select
                    id="sort-order"
                    value={sort.sortOrder}
                    onChange={(e) => updateSort("sortOrder", e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Exchange Filter */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("exchange")}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-medium text-white">Exchange</h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedSections.exchange ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.exchange && (
              <div className="mt-4">
                <select
                  value={filters.exchange || ""}
                  onChange={(e) =>
                    updateFilter("exchange", e.target.value || undefined)
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Exchanges</option>
                  {exchanges.map((exchange) => (
                    <option key={exchange} value={exchange}>
                      {exchange}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Class Filter */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("class")}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-medium text-white">Asset Class</h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedSections.class ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.class && (
              <div className="mt-4">
                <select
                  value={filters.class || ""}
                  onChange={(e) =>
                    updateFilter("class", e.target.value || undefined)
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Classes</option>
                  {classes.map((assetClass) => (
                    <option key={assetClass} value={assetClass}>
                      {assetClass}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Properties Filter */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("properties")}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-medium text-white">Properties</h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedSections.properties ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.properties && (
              <div className="mt-4 space-y-3">
                {[
                  { key: "tradable", label: "Tradable" },
                  { key: "marginable", label: "Marginable" },
                  { key: "shortable", label: "Shortable" },
                  { key: "fractionable", label: "Fractionable" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={filters[key as keyof FilterOptions] === true}
                      onChange={(e) =>
                        updateFilter(
                          key as keyof FilterOptions,
                          e.target.checked ? true : undefined,
                        )
                      }
                      className="w-4 h-4 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-700">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
            {getActiveFilterCount() > 0 && (
              <span className="text-sm text-gray-400">
                {getActiveFilterCount()} filter
                {getActiveFilterCount() !== 1 ? "s" : ""} active
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
