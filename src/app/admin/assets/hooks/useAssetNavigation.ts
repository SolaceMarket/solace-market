"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User as FirebaseUser } from "firebase/auth";

export function useAssetNavigation() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const navigateToAsset = async (
    symbol: string,
    firebaseUser: FirebaseUser | null,
    fallbackId?: string,
  ) => {
    if (!firebaseUser) {
      console.warn("No authenticated user for asset navigation");
      return;
    }

    setIsLoading(symbol);
    try {
      // First, try to find the asset by searching
      const token = await firebaseUser.getIdToken();
      const response = await fetch(
        `/api/admin/assets?search=${encodeURIComponent(symbol)}&limit=1`,
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
      console.warn("Could not find asset by search, trying fallback:", error);
    } finally {
      setIsLoading(null);
    }

    // Fallback: try using the provided fallback ID or symbol as ID
    const assetId = fallbackId || symbol.toLowerCase();
    router.push(`/admin/assets/${assetId}`);
  };

  return {
    navigateToAsset,
    isLoading,
  };
}
