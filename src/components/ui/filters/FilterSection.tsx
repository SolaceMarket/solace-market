import { ChevronDown } from "lucide-react";
import type { FilterSectionProps } from "./types";

export function FilterSection({
  title,
  isExpanded,
  onToggle,
  icon,
  children,
}: FilterSectionProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-lg font-medium text-white flex items-center space-x-2">
          {icon && icon}
          <span>{title}</span>
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && <div className="mt-4">{children}</div>}
    </div>
  );
}
