import { FilterSection } from "./FilterSection";
import type { FilterOptions } from "./types";

interface ClassFilterProps {
  classes: string[];
  selectedClass: string | undefined;
  onUpdateFilter: (key: keyof FilterOptions, value: string | undefined) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ClassFilter({
  classes,
  selectedClass,
  onUpdateFilter,
  isExpanded,
  onToggle,
}: ClassFilterProps) {
  return (
    <FilterSection
      title="Asset Class"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <select
        value={selectedClass || ""}
        onChange={(e) => onUpdateFilter("class", e.target.value || undefined)}
        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value="">All Classes</option>
        {classes.map((assetClass) => (
          <option key={assetClass} value={assetClass}>
            {assetClass}
          </option>
        ))}
      </select>
    </FilterSection>
  );
}
