"use client";

import { ChevronDown, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAssetLogo } from "../shared/AssetLogo";

interface CollateralAsset {
  symbol: string;
  name: string;
  logo: string;
  balance: number;
  usdValue: number;
  collateralRatio: number;
  maxCollateralValue: number;
}

interface CollateralAssetSearchProps {
  selectedAsset: string;
  onAssetSelect: (asset: CollateralAsset) => void;
  placeholder?: string;
  className?: string;
}

export function CollateralAssetSearch({
  selectedAsset,
  onAssetSelect,
  placeholder = "Search your assets...",
  className = "",
}: CollateralAssetSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState<CollateralAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<CollateralAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAssetData, setSelectedAssetData] =
    useState<CollateralAsset | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch collateral assets
  const fetchAssets = useCallback(
    async (query = "") => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append("search", query);

        const response = await fetch(
          `/api/portfolio/collateral-assets?${params}`,
        );
        const data = await response.json();

        if (data.success) {
          setAssets(data.assets);
          setFilteredAssets(data.assets);

          // Update selected asset data
          const currentAsset = data.assets.find(
            (asset: CollateralAsset) => asset.symbol === selectedAsset,
          );
          if (currentAsset) {
            setSelectedAssetData(currentAsset);
          }
        }
      } catch (error) {
        console.error("Error fetching collateral assets:", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedAsset],
  );

  // Initialize data
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Filter assets based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAssets(assets);
    } else {
      const filtered = assets.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredAssets(filtered);
    }
  }, [searchQuery, assets]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAssetSelect = (asset: CollateralAsset) => {
    setSelectedAssetData(asset);
    onAssetSelect(asset);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Selected Asset Display / Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        className="w-full bg-slate-600 rounded-lg p-3 hover:bg-slate-500 transition-colors focus:ring-2 focus:ring-green-500 outline-none"
      >
        {selectedAssetData ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                {getAssetLogo(selectedAssetData.logo)}
              </div>
              <div>
                <div className="text-white font-semibold">
                  {selectedAssetData.symbol}
                </div>
                <div className="text-gray-400 text-xs">
                  Balance: {selectedAssetData.balance.toFixed(4)} ($
                  {selectedAssetData.usdValue.toFixed(2)})
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">{placeholder}</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 rounded-lg border border-slate-600 shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-slate-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 bg-slate-600 text-white rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Assets List */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                Loading assets...
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                {searchQuery
                  ? "No assets found"
                  : "No collateral assets available"}
              </div>
            ) : (
              filteredAssets.map((asset) => (
                <button
                  key={asset.symbol}
                  type="button"
                  onClick={() => handleAssetSelect(asset)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleAssetSelect(asset);
                    }
                  }}
                  className="w-full p-3 hover:bg-slate-600 transition-colors border-b border-slate-600 last:border-b-0 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        {getAssetLogo(asset.logo)}
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {asset.symbol}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {asset.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm font-medium">
                        {asset.balance.toFixed(4)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        ${asset.usdValue.toFixed(2)}
                      </div>
                      <div className="text-green-400 text-xs">
                        Max: ${asset.maxCollateralValue.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
