"use client";

import { useEffect, useRef, useState } from "react";
import {
  ClassFilter,
  ExchangeFilter,
  FilterModalFooter,
  FilterModalHeader,
  type FilterOptions,
  PropertiesFilter,
  type SortOptions,
  SortSection,
} from "./filters";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4">
      <div
        ref={modalRef}
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md mt-2 overflow-y-auto"
      >
        <FilterModalHeader onClose={onClose} />

        {/* Filter Content */}
        <div className="p-6 space-y-6">
          <SortSection
            sort={sort}
            onUpdateSort={updateSort}
            isExpanded={expandedSections.sort}
            onToggle={() => toggleSection("sort")}
          />

          <ExchangeFilter
            exchanges={exchanges}
            selectedExchange={filters.exchange}
            onUpdateFilter={updateFilter}
            isExpanded={expandedSections.exchange}
            onToggle={() => toggleSection("exchange")}
          />

          <ClassFilter
            classes={classes}
            selectedClass={filters.class}
            onUpdateFilter={updateFilter}
            isExpanded={expandedSections.class}
            onToggle={() => toggleSection("class")}
          />

          <PropertiesFilter
            filters={filters}
            onUpdateFilter={updateFilter}
            isExpanded={expandedSections.properties}
            onToggle={() => toggleSection("properties")}
          />
        </div>

        <FilterModalFooter
          filters={filters}
          onClearAll={clearAllFilters}
          onCancel={onClose}
          onApply={applyFilters}
        />
      </div>
    </div>
  );
}
