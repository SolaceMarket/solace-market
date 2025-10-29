"use client";

import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { AssetLogo } from "@/components/ui/shared/AssetLogo";
import { useSolana } from "@/components/web3/solana/SolanaProvider";

// Mock portfolio data
const mockPortfolioData = {
  totalValue: "1,254.68 USD",
  todayChange: "+45.23 USD",
  todayChangePercent: "+3.74%",
  holdings: [
    {
      id: "apple",
      symbol: "AAPL",
      name: "Apple Inc.",
      quantity: "5.5",
      currentPrice: "174.50 USD",
      totalValue: "959.75 USD",
      change: "+2.3%",
      isPositive: true,
      logo: "apple",
    },
    {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      quantity: "0.0045",
      currentPrice: "65,500.00 USD",
      totalValue: "294.93 USD",
      change: "+5.1%",
      isPositive: true,
      logo: "bitcoin",
    },
  ],
};

export function WalletPortfolioPage() {
  const router = useRouter();
  const { isConnected, selectedWallet } = useSolana();

  // Redirect to onboarding if not connected
  if (!isConnected || !selectedWallet) {
    router.push("/web3-onboarding");
    return null;
  }

  return (
    <AppLayout title="Portfolio" showBackButton={true} backUrl="/assets-list">
      {/* Portfolio Summary */}
      <div className="p-6 border-b border-slate-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            {mockPortfolioData.totalValue}
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-green-400 text-lg font-semibold">
              {mockPortfolioData.todayChange}
            </span>
            <span className="text-green-400 text-lg">
              ({mockPortfolioData.todayChangePercent})
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">Today's Change</p>
        </div>
      </div>

      {/* Holdings List */}
      <div className="p-4 space-y-3">
        <h3 className="text-xl font-semibold text-white mb-4">Your Holdings</h3>
        {mockPortfolioData.holdings.map((holding) => (
          <div
            key={holding.id}
            className="bg-gradient-to-r from-slate-800 to-emerald-900/20 border border-emerald-700/30 rounded-lg p-4 flex items-center justify-between hover:from-slate-700 hover:to-emerald-800/30 transition-all duration-200"
          >
            {/* Left side - Logo and Info */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <AssetLogo
                  src={holding.logo}
                  alt={`${holding.symbol} logo`}
                  className="w-8 h-8"
                />
              </div>

              {/* Asset Info */}
              <div className="flex flex-col items-baseline">
                <div className="text-white font-semibold text-lg">
                  {holding.symbol}
                </div>
                <div className="text-gray-400 text-sm">
                  {holding.quantity} shares
                </div>
              </div>
            </div>

            {/* Right side - Values and Change */}
            <div className="text-right">
              <div className="text-white text-lg font-semibold">
                {holding.totalValue}
              </div>
              <div
                className={`text-sm font-semibold ${
                  holding.isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {holding.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
