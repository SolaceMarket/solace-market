"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/InitializeFirebase";
import type { User as FirebaseUser } from "firebase/auth";
import type { Pagination, AssetFilters } from "./types";
import { useAssets } from "./hooks/useAssets";
// import { useUrlSync } from "./hooks/useUrlSync"; // TODO: Implement Suspense boundary
import {
  AssetsPageHeader,
  AssetsFilters,
  AssetsTable,
  AssetsPagination,
} from "./components";

export default function AdminAssetsPage() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [quickAccessLoading, setQuickAccessLoading] = useState<string | null>(
    null,
  );
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<AssetFilters>({
    search: "",
    class: "",
    exchange: "",
    status: "",
    tradable: "",
  });

  // Synchronize state with URL parameters
  // TODO: Implement proper Suspense boundary for useSearchParams
  // useUrlSync({
  //   filters,
  //   pagination,
  //   onFiltersChange: setFilters,
  //   onPaginationChange: setPagination,
  // });

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
        return;
      }
      setFirebaseUser(user);
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch assets using TanStack Query
  const { data, isLoading, error, isFetching } = useAssets({
    firebaseUser,
    pagination,
    filters,
  });

  const assets = data?.assets || [];

  // Update pagination when data changes
  useEffect(() => {
    if (data?.pagination) {
      setPagination(data.pagination);
    }
  }, [data]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    // Reset to first page when filters change that could significantly change results
    // For search, we don't immediately reset since it's debounced
    if (key !== "search") {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  // Reset to page 1 when search actually changes (after debounce)
  const prevSearchRef = useRef(filters.search);
  useEffect(() => {
    // Only reset page if search term actually changed and it's not the initial load
    if (
      prevSearchRef.current !== filters.search &&
      prevSearchRef.current !== ""
    ) {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
    prevSearchRef.current = filters.search;
  }, [filters.search]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleAssetClick = (assetId: string) => {
    router.push(`/admin/assets/${assetId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching assets:", error);
    // For now, we'll just log the error and show empty state
    // You could create an AssetsErrorState component similar to AssetErrorState
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AssetsPageHeader firebaseUser={firebaseUser} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Access to Popular Assets */}
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
              onClick={() => {
                setFilters({
                  search: "",
                  class: "",
                  exchange: "",
                  status: "",
                  tradable: "",
                });
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="text-sm px-3 py-1.5 text-gray-600 hover:text-blue-600 border border-gray-300 hover:border-blue-300 rounded-md transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
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
            ].map((asset) => {
              const isLoading = quickAccessLoading === asset.symbol;
              return (
                <button
                  key={asset.symbol}
                  type="button"
                  disabled={isLoading}
                  onClick={async () => {
                    // First, try to find the asset by searching
                    setQuickAccessLoading(asset.symbol);
                    try {
                      if (!firebaseUser) return;

                      const token = await firebaseUser.getIdToken();
                      const response = await fetch(
                        `/api/admin/assets?search=${encodeURIComponent(asset.symbol)}&limit=1`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      );

                      if (response.ok) {
                        const data = await response.json();
                        if (data.assets && data.assets.length > 0) {
                          // Found the asset, navigate to its detail page
                          router.push(`/admin/assets/${data.assets[0].id}`);
                          return;
                        }
                      }
                    } catch (error) {
                      console.warn(
                        "Could not find asset by search, trying fallback:",
                        error,
                      );
                    } finally {
                      setQuickAccessLoading(null);
                    }

                    // Fallback: try using the symbol as ID (many assets use symbol as ID)
                    router.push(`/admin/assets/${asset.symbol.toLowerCase()}`);
                  }}
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

        {/* Base Currency Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Filter by Base Currency
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Click to filter assets tradable against these currencies
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
            {[
              { symbol: "BTC", name: "Bitcoin", icon: "₿", color: "orange" },
              { symbol: "SOL", name: "Solana", icon: "◎", color: "purple" },
              { symbol: "USDC", name: "USD Coin", icon: "💵", color: "blue" },
              { symbol: "USDT", name: "Tether", icon: "💚", color: "green" },
            ].map((currency) => {
              const isActive =
                filters.search === currency.symbol &&
                filters.class === "crypto";
              return (
                <button
                  key={currency.symbol}
                  type="button"
                  onClick={() => {
                    // Search for assets that include this currency in their symbol (e.g., BTC/USD, SOL/BTC, etc.)
                    setFilters((prev) => ({
                      ...prev,
                      search: currency.symbol,
                      class: "crypto",
                    }));
                    // Reset pagination when using filters
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 group ${
                    isActive
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  <div className="text-3xl mb-2">{currency.icon}</div>
                  <div
                    className={`text-base font-semibold ${
                      isActive
                        ? "text-blue-700"
                        : "text-gray-900 group-hover:text-blue-600"
                    }`}
                  >
                    {currency.symbol}
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-500 group-hover:text-blue-500"
                    }`}
                  >
                    Trading pairs with {currency.symbol}
                  </div>
                  <div
                    className={`text-xs px-3 py-1.5 rounded-full mt-2 ${
                      currency.color === "orange"
                        ? isActive
                          ? "bg-orange-200 text-orange-800"
                          : "bg-orange-100 text-orange-700 group-hover:bg-orange-200"
                        : currency.color === "purple"
                          ? isActive
                            ? "bg-purple-200 text-purple-800"
                            : "bg-purple-100 text-purple-700 group-hover:bg-purple-200"
                          : currency.color === "green"
                            ? isActive
                              ? "bg-green-200 text-green-800"
                              : "bg-green-100 text-green-700 group-hover:bg-green-200"
                            : isActive
                              ? "bg-blue-200 text-blue-800"
                              : "bg-blue-100 text-blue-700 group-hover:bg-blue-200"
                    }`}
                  >
                    Filter Pairs
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <AssetsFilters filters={filters} onFilterChange={handleFilterChange} />

        <div className="space-y-6">
          <AssetsTable
            assets={assets}
            pagination={pagination}
            onAssetClick={handleAssetClick}
            isLoading={isFetching}
          />

          <AssetsPagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
