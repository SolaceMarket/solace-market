import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AssetFilters, Pagination } from "../types";

interface UseUrlSyncOptions {
  filters: AssetFilters;
  pagination: Pagination;
  onFiltersChange: (filters: AssetFilters) => void;
  onPaginationChange: (pagination: Pagination) => void;
}

/**
 * Hook to synchronize filters and pagination with URL parameters
 * This ensures that the current search state is preserved across page refreshes
 * and enables sharing filtered views via URL
 */
export function useUrlSync({
  filters,
  pagination,
  onFiltersChange,
  onPaginationChange,
}: UseUrlSyncOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL on mount
  useEffect(() => {
    const urlFilters: AssetFilters = {
      search: searchParams.get("search") || "",
      class: searchParams.get("class") || "",
      exchange: searchParams.get("exchange") || "",
      status: searchParams.get("status") || "",
      tradable: searchParams.get("tradable") || "",
    };

    const urlPagination: Pagination = {
      ...pagination,
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "50", 10),
    };

    // Only update if there are actual differences
    const filtersChanged = Object.keys(urlFilters).some(
      (key) =>
        urlFilters[key as keyof AssetFilters] !==
        filters[key as keyof AssetFilters],
    );

    const paginationChanged =
      urlPagination.page !== pagination.page ||
      urlPagination.limit !== pagination.limit;

    if (filtersChanged) {
      onFiltersChange(urlFilters);
    }

    if (paginationChanged) {
      onPaginationChange(urlPagination);
    }
  }, [searchParams]); // Only depend on searchParams

  // Update URL when filters or pagination change
  useEffect(() => {
    const params = new URLSearchParams();

    // Add filters to URL
    if (filters.search) params.set("search", filters.search);
    if (filters.class) params.set("class", filters.class);
    if (filters.exchange) params.set("exchange", filters.exchange);
    if (filters.status) params.set("status", filters.status);
    if (filters.tradable) params.set("tradable", filters.tradable);

    // Add pagination to URL
    if (pagination.page > 1) params.set("page", pagination.page.toString());
    if (pagination.limit !== 50)
      params.set("limit", pagination.limit.toString());

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : "/admin/assets";

    // Only update URL if it's different from current
    if (window.location.search !== `?${params.toString()}`) {
      router.replace(newUrl, { scroll: false });
    }
  }, [filters, pagination.page, pagination.limit, router]);
}
