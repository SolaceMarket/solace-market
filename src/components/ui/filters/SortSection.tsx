import { ArrowUpDown } from "lucide-react";
import { FilterSection } from "./FilterSection";
import type { SortOptions } from "./types";

interface SortSectionProps {
  sort: SortOptions;
  onUpdateSort: (key: keyof SortOptions, value: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SortSection({
  sort,
  onUpdateSort,
  isExpanded,
  onToggle,
}: SortSectionProps) {
  return (
    <FilterSection
      title="Sort"
      isExpanded={isExpanded}
      onToggle={onToggle}
      icon={<ArrowUpDown className="w-5 h-5 text-emerald-400" />}
    >
      <div className="space-y-4">
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
            onChange={(e) => onUpdateSort("sortBy", e.target.value)}
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
            onChange={(e) => onUpdateSort("sortOrder", e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </FilterSection>
  );
}
