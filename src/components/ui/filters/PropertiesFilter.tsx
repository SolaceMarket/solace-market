import { FilterSection } from "./FilterSection";
import type { FilterOptions } from "./types";

interface PropertiesFilterProps {
  filters: FilterOptions;
  onUpdateFilter: (
    key: keyof FilterOptions,
    value: boolean | undefined,
  ) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const PROPERTY_OPTIONS = [
  { key: "tradable", label: "Tradable" },
  { key: "marginable", label: "Marginable" },
  { key: "shortable", label: "Shortable" },
  { key: "fractionable", label: "Fractionable" },
] as const;

export function PropertiesFilter({
  filters,
  onUpdateFilter,
  isExpanded,
  onToggle,
}: PropertiesFilterProps) {
  return (
    <FilterSection
      title="Properties"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        {PROPERTY_OPTIONS.map(({ key, label }) => (
          <label key={key} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={filters[key] === true}
              onChange={(e) =>
                onUpdateFilter(key, e.target.checked ? true : undefined)
              }
              className="w-4 h-4 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
            />
            <span className="text-gray-300">{label}</span>
          </label>
        ))}
      </div>
    </FilterSection>
  );
}
