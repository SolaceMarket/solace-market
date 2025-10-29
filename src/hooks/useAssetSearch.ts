import { useCallback, useEffect, useState } from "react";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  logo: string;
  category: string;
  market: string;
  description: string;
}

interface SearchResponse {
  success: boolean;
  data: Asset[];
  total: number;
  hasMore: boolean;
  query?: string;
}

interface UseAssetSearchOptions {
  debounceMs?: number;
  limit?: number;
}

export function useAssetSearch(options: UseAssetSearchOptions = {}) {
  const { debounceMs = 300, limit = 10 } = options;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Fetch assets when debounced query changes
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: "0",
        });

        if (debouncedQuery) {
          params.set("q", debouncedQuery);
        }

        const response = await fetch(`/api/assets?${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch assets");
        }

        const data: SearchResponse = await response.json();

        if (data.success) {
          setAssets(data.data);
          setTotal(data.total);
          setHasMore(data.hasMore);
        } else {
          throw new Error("API returned error");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setAssets([]);
        setTotal(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [debouncedQuery, limit]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  return {
    query,
    setQuery,
    assets,
    loading,
    error,
    total,
    hasMore,
    clearSearch,
    isSearching: debouncedQuery.length > 0,
  };
}
