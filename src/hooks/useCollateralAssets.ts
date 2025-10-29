import { useCallback, useEffect, useState } from "react";

interface CollateralAssetResponse {
  symbol: string;
  name: string;
  logo: string;
  balance: number;
  usdValue: number;
  collateralRatio: number;
  maxCollateralValue: number;
  location: "wallet" | "exchange";
  transferTime: string | null;
  canTransferForTrading: boolean;
}

interface CollateralAsset {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  balance: number;
  usdValue: number;
  collateralRatio: number;
  maxCollateralValue: number;
  category: string;
  market: string;
  description: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  location: "wallet" | "exchange";
  transferTime: string | null;
  canTransferForTrading: boolean;
}

interface UseCollateralAssetsProps {
  debounceMs?: number;
  limit?: number;
}

export function useCollateralAssets({
  debounceMs = 300,
  limit = 20,
}: UseCollateralAssetsProps = {}) {
  const [query, setQuery] = useState("");
  const [assets, setAssets] = useState<CollateralAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchAssets = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        // If no query, fetch all collateral assets
        setLoading(true);
        setError(null);

        try {
          const response = await fetch("/api/portfolio/collateral-assets");
          const data = await response.json();

          if (data.success) {
            // Transform to match Asset interface
            const transformedAssets = data.assets.map(
              (asset: CollateralAssetResponse) => ({
                id: asset.symbol,
                symbol: asset.symbol,
                name: asset.name,
                logo: asset.logo,
                balance: asset.balance,
                usdValue: asset.usdValue,
                collateralRatio: asset.collateralRatio,
                maxCollateralValue: asset.maxCollateralValue,
                category: "Portfolio",
                market: "Collateral",
                description: `Available: ${asset.balance.toFixed(4)} (Max collateral: $${asset.maxCollateralValue.toFixed(2)})`,
                price: asset.usdValue.toFixed(2),
                change: "+0.00",
                changePercent: "+0.00%",
                isPositive: true,
                location: asset.location,
                transferTime: asset.transferTime,
                canTransferForTrading: asset.canTransferForTrading,
              }),
            );
            setAssets(transformedAssets);
          } else {
            setError("Failed to fetch portfolio assets");
          }
        } catch (err) {
          setError("Error fetching portfolio assets");
          console.error("Error fetching collateral assets:", err);
        } finally {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      setIsSearching(true);

      try {
        const params = new URLSearchParams();
        params.append("search", searchQuery);
        if (limit) params.append("limit", limit.toString());

        const response = await fetch(
          `/api/portfolio/collateral-assets?${params}`,
        );
        const data = await response.json();

        if (data.success) {
          // Transform to match Asset interface
          const transformedAssets = data.assets.map(
            (asset: CollateralAssetResponse) => ({
              id: asset.symbol,
              symbol: asset.symbol,
              name: asset.name,
              logo: asset.logo,
              balance: asset.balance,
              usdValue: asset.usdValue,
              collateralRatio: asset.collateralRatio,
              maxCollateralValue: asset.maxCollateralValue,
              category: "Portfolio",
              market: "Collateral",
              description: `Available: ${asset.balance.toFixed(4)} (Max collateral: $${asset.maxCollateralValue.toFixed(2)})`,
              price: asset.usdValue.toFixed(2),
              change: "+0.00",
              changePercent: "+0.00%",
              isPositive: true,
              location: asset.location,
              transferTime: asset.transferTime,
              canTransferForTrading: asset.canTransferForTrading,
            }),
          );
          setAssets(transformedAssets);
        } else {
          setError("Failed to fetch portfolio assets");
        }
      } catch (err) {
        setError("Error searching portfolio assets");
        console.error("Error searching collateral assets:", err);
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssets(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, fetchAssets]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setAssets([]);
    setError(null);
    setIsSearching(false);
  }, []);

  return {
    query,
    setQuery,
    assets,
    loading,
    error,
    clearSearch,
    isSearching,
  };
}
