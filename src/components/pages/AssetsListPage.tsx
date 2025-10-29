"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AssetFilterModal } from "@/components/ui/modals/AssetFilterModal";
import { AssetSearchModal } from "@/components/ui/modals/AssetSearchModal";
import { AssetLogo } from "@/components/ui/shared/AssetLogo";
import { useSolana } from "@/components/web3/solana/SolanaProvider";
import { getListAssets } from "@/data/mockAssets";

// Use centralized mock data
const mockAssets = getListAssets();

interface FilterOptions {
  exchange?: string;
  class?: string;
  tradable?: boolean;
  marginable?: boolean;
  shortable?: boolean;
  fractionable?: boolean;
  status?: string;
}

interface SortOptions {
  sortBy: "symbol" | "name" | "exchange" | "class";
  sortOrder: "asc" | "desc";
}

export function AssetsListPage() {
  const router = useRouter();
  const { isConnected, selectedWallet } = useSolana();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Mock filter data - in a real app, these would come from an API
  const mockExchanges = ["NASDAQ", "NYSE", "CRYPTO"];
  const mockClasses = ["us_equity", "crypto", "forex"];

  // Filter and sort state
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOptions>({
    sortBy: "symbol",
    sortOrder: "asc",
  });

  const handleApplyFilters = (
    newFilters: FilterOptions,
    newSort: SortOptions,
  ) => {
    setFilters(newFilters);
    setSort(newSort);
    // In a real app, this would trigger a data refetch with the new filters
  };

  // Redirect to onboarding if not connected
  if (!isConnected || !selectedWallet) {
    router.push("/web3-onboarding");
    return null;
  }

  return (
    <AppLayout
      title="Available Assets"
      showSearch={true}
      onSearchClick={() => setIsSearchModalOpen(true)}
      searchTitle="Search assets"
      showFilterButton={true}
      onFilterClick={() => setIsFilterModalOpen(true)}
      filterTitle="Filter assets"
    >
      {/* Assets List */}
      <div className="p-4 space-y-3">
        {mockAssets.map((asset, index) => (
          <button
            key={`${asset.id}-${index}`}
            type="button"
            onClick={() => router.push(`/asset/${asset.symbol}`)}
            className="w-full bg-gradient-to-r from-slate-800 to-emerald-900/20 border border-emerald-700/30 rounded-lg p-4 flex items-center justify-between hover:from-slate-700 hover:to-emerald-800/30 transition-all duration-200"
          >
            {/* Left side - Logo and Info */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <AssetLogo
                  src={asset.logo}
                  alt={`${asset.symbol} Logo`}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>

              {/* Asset Info */}
              <div className="flex flex-col items-baseline">
                <div className="text-white font-semibold text-lg">
                  {asset.symbol}
                </div>
                <div className="text-white text-base opacity-90">
                  {asset.price}
                </div>
              </div>
            </div>

            {/* Right side - Category and Change */}
            <div className="text-right">
              <div className="text-gray-300 text-sm mb-1">{asset.category}</div>
              <div
                className={`text-lg font-semibold ${
                  asset.isPositive ? "text-yellow-400" : "text-red-400"
                }`}
              >
                {asset.change}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Asset Search Modal */}
      <AssetSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Asset Filter Modal */}
      <AssetFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        exchanges={mockExchanges}
        classes={mockClasses}
        currentFilters={filters}
        currentSort={sort}
      />
    </AppLayout>
  );
}
