import type { User as FirebaseUser } from "firebase/auth";
import { useAuthenticatedQuery } from "@/lib/hooks/useAuthenticatedQuery";
import { useDebounce } from "./useDebounce";
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
  // Debounce search to avoid excessive API calls (300ms delay)
  const debouncedSearch = useDebounce(filters.search, 300);

  const params = new URLSearchParams({
    page: pagination.page.toString(),
    limit: pagination.limit.toString(),
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(filters.class && { class: filters.class }),
    ...(filters.exchange && { exchange: filters.exchange }),
    ...(filters.status && { status: filters.status }),
    ...(filters.tradable && { tradable: filters.tradable }),
  });

  return useAuthenticatedQuery<AssetsResponse>(
    {
      firebaseUser,
      endpoint: `/api/admin/assets?${params}`,
      queryKey: [
        "admin",
        "assets",
        pagination.page,
        pagination.limit,
        debouncedSearch, // Use debounced search in query key
        filters.class,
        filters.exchange,
        filters.status,
        filters.tradable,
      ],
      enabled,
    },
    {
      // Add staleTime to prevent unnecessary refetches
      staleTime: 30000, // 30 seconds
      // Keep previous data while loading new data for smoother UX
      placeholderData: (previousData) => previousData,
    },
  );
}
