"use client";

import { AdminTradingSection } from "@/components/admin/AdminTradingSection";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import type { Asset } from "@/alpaca/assets/Asset";

interface AssetPageAdminSectionProps {
  asset: Asset;
}

export function AssetPageAdminSection({ asset }: AssetPageAdminSectionProps) {
  const { isAdmin, loading } = useAdminCheck();

  // Don't render anything while loading or if user is not admin
  if (loading || !isAdmin) {
    return null;
  }

  return (
    <div className="mb-8">
      <AdminTradingSection asset={asset} />
    </div>
  );
}
