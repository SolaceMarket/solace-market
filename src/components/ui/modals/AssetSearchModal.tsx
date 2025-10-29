"use client";

import { useRouter } from "next/navigation";
import { useAssetSearch } from "@/hooks/useAssetSearch";
import { BaseAssetSearchModal } from "../base/BaseAssetSearchModal";

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

interface AssetSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetSelect?: (asset: Asset) => void;
}

export function AssetSearchModal({
  isOpen,
  onClose,
  onAssetSelect,
}: AssetSearchModalProps) {
  const router = useRouter();
  const { query, setQuery, assets, loading, error, clearSearch, isSearching } =
    useAssetSearch({
      debounceMs: 300,
      limit: 20,
    });

  const handleAssetSelect = (asset: Asset) => {
    if (onAssetSelect) {
      onAssetSelect(asset);
    } else {
      router.push(`/assets/${asset.symbol}`);
    }
  };

  return (
    <BaseAssetSearchModal
      isOpen={isOpen}
      onClose={onClose}
      onAssetSelect={handleAssetSelect}
      assets={assets}
      loading={loading}
      error={error}
      query={query}
      setQuery={setQuery}
      clearSearch={clearSearch}
      isSearching={isSearching}
      placeholder="Search (e.g. Apple, BTC, MSFT)..."
      title="Search Assets"
      emptyStateMessage="Start typing to search for assets..."
      noResultsMessage={undefined}
    />
  );
}
