import type { User as FirebaseUser } from "firebase/auth";

export interface AssetDetails {
  id: string;
  class: string;
  exchange: string;
  symbol: string;
  name: string;
  status: string;
  tradable: boolean;
  marginable: boolean;
  maintenanceMarginRequirement: number;
  marginRequirementLong: string;
  marginRequirementShort: string;
  shortable?: boolean;
  easyToBorrow?: boolean;
  fractionable?: boolean;
  attributes?: string;
  createdAt: string;
  updatedAt: string;
}

// Alias for AdminAsset (same structure as AssetDetails)
export type AdminAsset = AssetDetails;

export type AssetStatus = "active" | "inactive" | "delisted";

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AssetFilters {
  search: string;
  class: string;
  exchange: string;
  status: string;
  tradable: string;
}

export interface AssetDetailsPageProps {
  asset: AssetDetails;
  onRefresh: () => void;
}

export interface AssetComponentProps {
  asset: AssetDetails;
}

export interface AssetsListProps {
  assets: AdminAsset[];
  pagination: Pagination;
  onAssetClick: (assetId: string) => void;
  isLoading?: boolean;
}

export interface AssetsFiltersProps {
  filters: AssetFilters;
  onFilterChange: (key: string, value: string) => void;
}

export interface AssetsPaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

// New types for refactored components
export interface QuickAccessAsset {
  symbol: string;
  name: string;
  type: "crypto" | "stock";
  icon: string;
  id: string;
}

export interface BaseCurrency {
  symbol: string;
  name: string;
  icon: string;
  color: "orange" | "purple" | "blue" | "green";
}

export interface QuickAccessSectionProps {
  firebaseUser: FirebaseUser | null;
  onClearFilters: () => void;
  onNavigateToAsset?: (assetId: string) => void;
}

export interface BaseCurrencyFiltersProps {
  filters: AssetFilters;
  onFilterChange: (filters: Partial<AssetFilters>) => void;
  onResetPagination: () => void;
}
