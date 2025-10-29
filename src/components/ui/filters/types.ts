export interface FilterOptions {
  exchange?: string;
  class?: string;
  tradable?: boolean;
  marginable?: boolean;
  shortable?: boolean;
  fractionable?: boolean;
  status?: string;
}

export interface SortOptions {
  sortBy: "symbol" | "name" | "exchange" | "class";
  sortOrder: "asc" | "desc";
}

export interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
