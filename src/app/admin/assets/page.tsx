"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/InitializeFirebase";
import type { User as FirebaseUser } from "firebase/auth";
import type { Pagination, AssetFilters } from "./types";
import { useAssets } from "./hooks/useAssets";
import {
  AssetsPageHeader,
  AssetsFilters,
  AssetsTable,
  AssetsPagination,
} from "./components";

export default function AdminAssetsPage() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
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
  const {
    data: assetsData,
    isLoading: loading,
    error,
  } = useAssets({
    firebaseUser,
    pagination,
    filters,
  });

  const assets = assetsData?.assets || [];

  // Update pagination when data changes
  useEffect(() => {
    if (assetsData?.pagination) {
      setPagination(assetsData.pagination);
    }
  }, [assetsData]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleAssetClick = (assetId: string) => {
    router.push(`/admin/assets/${assetId}`);
  };

  if (loading) {
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
        <AssetsFilters filters={filters} onFilterChange={handleFilterChange} />

        <div className="space-y-6">
          <AssetsTable
            assets={assets}
            pagination={pagination}
            onAssetClick={handleAssetClick}
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
