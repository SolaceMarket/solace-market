"use client";

import { Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

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

function getAssetLogo(logoType: string | undefined | null) {
  // Handle undefined, null, or empty logoType
  if (!logoType) {
    return (
      <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
        ?
      </div>
    );
  }

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
          {logoType.charAt(0).toUpperCase()}
        </div>
      );
  }
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
                    {getAssetLogo(asset.logo)}
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
