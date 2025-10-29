import { FilterSection } from "./FilterSection";
import type { FilterOptions } from "./types";

interface ExchangeFilterProps {
  exchanges: string[];
  selectedExchange: string | undefined;
  onUpdateFilter: (key: keyof FilterOptions, value: string | undefined) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ExchangeFilter({
  exchanges,
  selectedExchange,
  onUpdateFilter,
  isExpanded,
  onToggle,
}: ExchangeFilterProps) {
  return (
    <FilterSection title="Exchange" isExpanded={isExpanded} onToggle={onToggle}>
      <select
        value={selectedExchange || ""}
        onChange={(e) =>
          onUpdateFilter("exchange", e.target.value || undefined)
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
    </FilterSection>
  );
}
