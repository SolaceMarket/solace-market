"use client";

import { AssetPageAdminSection } from "@/components/admin/AssetPageAdminSection";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/InitializeFirebase";
import type { User as FirebaseUser } from "firebase/auth";
import { useAssetDetails } from "../hooks/useAssetDetails";
import { assetDetailsToAsset } from "@/utils/assetAdapters";
import {
  AssetHeader,
  AssetBasicInfo,
  AssetTradingInfo,
  AssetMarginInfo,
  AssetSidebar,
  AssetErrorState,
} from "../components";

export default function AdminAssetDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const assetId = params.id as string;

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

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

  // Fetch asset details using TanStack Query
  const {
    data: assetData,
    isLoading: loading,
    error,
    refetch: fetchAssetDetails,
  } = useAssetDetails({
    firebaseUser,
    assetId,
  });

  const asset = assetData?.asset;

  if (loading && !asset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <AssetErrorState
        error={error.message}
        onBackClick={() => router.push("/admin/assets")}
      />
    );
  }

  if (!asset) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AssetHeader asset={asset} firebaseUser={firebaseUser} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <AssetBasicInfo asset={asset} />
            <AssetTradingInfo asset={asset} />
            <AssetMarginInfo asset={asset} />

            {/* Admin Trading Section - Only visible to admins */}
            <AssetPageAdminSection asset={assetDetailsToAsset(asset)} />
          </div>

          {/* Sidebar */}
          <AssetSidebar asset={asset} onRefresh={() => fetchAssetDetails()} />
        </div>
      </div>
    </div>
  );
}
