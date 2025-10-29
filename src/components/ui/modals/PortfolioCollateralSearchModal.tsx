"use client";

import { useCollateralAssets } from "@/hooks/useCollateralAssets";
import { BaseAssetSearchModal } from "../base/BaseAssetSearchModal";

interface CollateralAsset {
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
  balance: number;
  usdValue: number;
  collateralRatio: number;
  maxCollateralValue: number;
  location: "wallet" | "exchange";
  transferTime: string | null;
  canTransferForTrading: boolean;
}

interface PortfolioCollateralSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetSelect: (asset: CollateralAsset) => void;
}

export function PortfolioCollateralSearchModal({
  isOpen,
  onClose,
  onAssetSelect,
}: PortfolioCollateralSearchModalProps) {
  const { query, setQuery, assets, loading, error, clearSearch, isSearching } =
    useCollateralAssets({
      debounceMs: 300,
      limit: 20,
    });

  const handleAssetSelect = (asset: CollateralAsset) => {
    onAssetSelect(asset);
  };

  const renderAssetExtra = (asset: CollateralAsset) => (
    <p className="text-gray-400 text-xs">
      Balance: {asset.balance.toFixed(4)} • Max: $
      {asset.maxCollateralValue.toFixed(2)}
    </p>
  );

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
      placeholder="Search your portfolio assets..."
      title="Select Collateral Asset"
      emptyStateMessage="Loading your portfolio assets..."
      noResultsMessage="No collateral assets found in your portfolio"
      renderAssetExtra={renderAssetExtra}
    />
  );
}
