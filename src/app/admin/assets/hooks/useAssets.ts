import type { User as FirebaseUser } from "firebase/auth";
import { useAuthenticatedQuery } from "@/lib/hooks/useAuthenticatedQuery";
import type { AdminAsset, Pagination, AssetFilters } from "../types";

interface UseAssetsOptions {
  firebaseUser: FirebaseUser | null;
  pagination: Pagination;
  filters: AssetFilters;
  enabled?: boolean;
}

interface AssetsResponse {
  assets: AdminAsset[];
  pagination: Pagination;
}

export function useAssets({
  firebaseUser,
  pagination,
  filters,
  enabled = true,
}: UseAssetsOptions) {
  const params = new URLSearchParams({
    page: pagination.page.toString(),
    limit: pagination.limit.toString(),
    ...(filters.search && { search: filters.search }),
    ...(filters.class && { class: filters.class }),
    ...(filters.exchange && { exchange: filters.exchange }),
    ...(filters.status && { status: filters.status }),
    ...(filters.tradable && { tradable: filters.tradable }),
  });

  return useAuthenticatedQuery<AssetsResponse>({
    firebaseUser,
    endpoint: `/api/admin/assets?${params}`,
    queryKey: [
      "admin",
      "assets",
      pagination.page,
      pagination.limit,
      filters.search,
      filters.class,
      filters.exchange,
      filters.status,
      filters.tradable,
    ],
    enabled,
  });
}
