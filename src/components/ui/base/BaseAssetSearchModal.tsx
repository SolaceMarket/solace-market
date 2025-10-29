"use client";

import { Loader2, Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { AssetLogo } from "../shared/AssetLogo";

interface BaseAsset {
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

interface BaseAssetSearchModalProps<T extends BaseAsset> {
  isOpen: boolean;
  onClose: () => void;
  onAssetSelect: (asset: T) => void;
  assets: T[];
  loading: boolean;
  error: string | null;
  query: string;
  setQuery: (query: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
  placeholder?: string;
  title?: string;
  emptyStateMessage?: string;
  noResultsMessage?: string;
  renderAssetExtra?: (asset: T) => React.ReactNode;
}

export function BaseAssetSearchModal<T extends BaseAsset>({
  isOpen,
  onClose,
  onAssetSelect,
  assets,
  loading,
  error,
  query,
  setQuery,
  clearSearch,
  isSearching,
  placeholder = "Search assets...",
  title = "Search Assets",
  emptyStateMessage = "Start typing to search for assets...",
  noResultsMessage,
  renderAssetExtra,
}: BaseAssetSearchModalProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const handleAssetClick = (asset: T) => {
    onAssetSelect(asset);
    onClose();
  };

  const handleClose = () => {
    clearSearch();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close search"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-slate-800 rounded-lg shadow-xl border border-slate-600 overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-slate-600">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
          />
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors ml-3"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin mr-2" />
              <span className="text-gray-400">Searching...</span>
            </div>
          )}

          {error && <div className="p-4 text-red-400 text-center">{error}</div>}

          {!loading && !error && assets.length === 0 && isSearching && (
            <div className="p-8 text-center text-gray-400">
              {noResultsMessage || `No assets found for "${query}"`}
            </div>
          )}

          {!loading && !error && assets.length === 0 && !isSearching && (
            <div className="p-8 text-center text-gray-400">
              {emptyStateMessage}
            </div>
          )}

          {!loading && !error && assets.length > 0 && (
            <div className="p-2">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => handleAssetClick(asset)}
                  className="w-full p-3 rounded-lg hover:bg-slate-700 transition-colors flex items-center space-x-4 text-left"
                >
                  {/* Logo */}
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <AssetLogo
                      src={asset.logo}
                      alt={`${asset.symbol} Logo`}
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>

                  {/* Asset Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">
                        {asset.symbol}
                      </span>
                      <span className="text-xs text-gray-400 bg-slate-600 px-2 py-1 rounded">
                        {asset.category}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm truncate">
                      {asset.name}
                    </p>
                    {renderAssetExtra && renderAssetExtra(asset)}
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-white font-semibold">
                      ${asset.price}
                    </div>
                    <div
                      className={`text-sm ${
                        asset.isPositive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {asset.change} ({asset.changePercent})
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
