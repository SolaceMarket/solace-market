"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AssetFilterModal } from "@/components/ui/AssetFilterModal";
import { AssetSearchModal } from "@/components/ui/AssetSearchModal";
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

function getAssetLogo(logoType: string) {
  switch (logoType) {
    case "apple":
      return (
        <Image
          src="/logos/apple.svg"
          alt="Apple Logo"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      );
    case "bitcoin":
      return (
        <Image
          src="/logos/bitcoin.svg"
          alt="Bitcoin Logo"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      );
    case "microsoft":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8"
          aria-label="Microsoft Logo"
        >
          <title>Microsoft Logo</title>
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M13 1h10v10H13z" />
          <path fill="#05a6f0" d="M1 13h10v10H1z" />
          <path fill="#ffba08" d="M13 13h10v10H13z" />
        </svg>
      );
    case "google":
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8" aria-label="Google Logo">
          <title>Google Logo</title>
          <path
            fill="#4285f4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34a853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#fbbc05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#ea4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      );
    case "solana":
      return (
        <Image
          src="/logos/solana.svg"
          alt="Solana Logo"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      );
    default:
      return (
        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          ?
        </div>
      );
  }
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
                {getAssetLogo(asset.logo)}
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
