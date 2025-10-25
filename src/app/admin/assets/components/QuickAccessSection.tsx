"use client";

import { useAssetNavigation } from "../hooks/useAssetNavigation";
import type { QuickAccessAsset, QuickAccessSectionProps } from "../types";

const POPULAR_ASSETS: QuickAccessAsset[] = [
  {
    symbol: "BTC/USD",
    name: "Bitcoin",
    type: "crypto",
    icon: "₿",
    id: "btc-usd",
  },
  {
    symbol: "BTC/USDC",
    name: "Bitcoin/USDC",
    type: "crypto",
    icon: "₿",
    id: "btc-usdc",
  },
  {
    symbol: "SOL/USD",
    name: "Solana",
    type: "crypto",
    icon: "◎",
    id: "sol-usd",
  },
  {
    symbol: "SOL/USDC",
    name: "Solana/USDC",
    type: "crypto",
    icon: "◎",
    id: "sol-usdc",
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    type: "stock",
    icon: "🏢",
    id: "msft",
  },
  {
    symbol: "AAPL",
    name: "Apple",
    type: "stock",
    icon: "🍎",
    id: "aapl",
  },
];

export function QuickAccessSection({
  firebaseUser,
  onClearFilters,
}: QuickAccessSectionProps) {
  const { navigateToAsset, isLoading: hookLoading } = useAssetNavigation();

  const handleAssetClick = async (asset: QuickAccessAsset) => {
    await navigateToAsset(asset.symbol, firebaseUser, asset.id);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Quick Access - Popular Assets
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Click to open asset details
          </p>
        </div>
        <button
          type="button"
          onClick={onClearFilters}
          className="text-sm px-3 py-1.5 text-gray-600 hover:text-blue-600 border border-gray-300 hover:border-blue-300 rounded-md transition-colors duration-200"
        >
          Clear All Filters
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {POPULAR_ASSETS.map((asset) => {
          const isLoading = hookLoading === asset.symbol;
          return (
            <button
              key={asset.symbol}
              type="button"
              disabled={isLoading}
              onClick={() => handleAssetClick(asset)}
              className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 group border-gray-200 hover:border-blue-500 hover:bg-blue-50 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              <div className="text-2xl mb-1 relative">
                {isLoading ? (
                  <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                ) : (
                  asset.icon
                )}
              </div>
              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                {asset.symbol}
              </div>
              <div className="text-xs mt-1 text-gray-500 group-hover:text-blue-500">
                {asset.name}
              </div>
              <div
                className={`text-xs px-2 py-1 rounded-full mt-2 ${
                  asset.type === "crypto"
                    ? "bg-orange-100 text-orange-700 group-hover:bg-orange-200"
                    : "bg-blue-100 text-blue-700 group-hover:bg-blue-200"
                }`}
              >
                {asset.type === "crypto" ? "Crypto" : "Stock"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
