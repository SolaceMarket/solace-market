"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AssetInfoHeader } from "@/components/ui/assets/AssetInfoHeader";
import { TradingInterface } from "@/components/ui/trading/TradingInterface";
import { useSolana } from "@/components/web3/solana/SolanaProvider";
import { getSwapAssets } from "@/data/mockAssets";

const mockAssets = getSwapAssets();

interface AssetSwapPageProps {
  symbol: string;
}

export function AssetSwapPage({ symbol }: AssetSwapPageProps) {
  const router = useRouter();
  const { isConnected, selectedWallet } = useSolana();

  // Redirect to onboarding if not connected
  useEffect(() => {
    if (!isConnected || !selectedWallet) {
      router.push("/web3-onboarding");
    }
  }, [isConnected, selectedWallet, router]);

  if (!isConnected || !selectedWallet) {
    return null;
  }

  const asset = mockAssets[symbol.toUpperCase()];

  if (!asset) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Asset Not Found</h1>
          <button
            type="button"
            onClick={() => router.push("/assets-list")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Assets
          </button>
        </div>
      </div>
    );
  }

  const handleTradeComplete = () => {
    router.push("/wallet-portfolio");
  };

  return (
    <AppLayout title="Trade" showBackButton={true} backUrl="/assets-list">
      <AssetInfoHeader asset={asset} />
      <TradingInterface
        embedded
        asset={asset}
        onTradeComplete={handleTradeComplete}
      />
      {/* <SwapInterface asset={asset} onTradeComplete={handleTradeComplete} /> */}
    </AppLayout>
  );
}
