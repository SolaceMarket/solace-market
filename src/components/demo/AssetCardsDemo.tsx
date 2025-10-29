import type { Asset } from "@/alpaca/assets/Asset";
import type { AssetStats } from "@/data/assetData";
import { AssetCard } from "../ui/AssetCard";

export function AssetCardsDemo() {
  // Mock asset data
  const mockAssets: Array<{ asset: Asset; stats: AssetStats }> = [
    {
      asset: {
        id: "AAPL",
        class: "us_equity",
        exchange: "NASDAQ",
        symbol: "AAPL",
        name: "Apple Inc.",
        status: "active",
        tradable: true,
        marginable: true,
        maintenance_margin_requirement: 0.25,
        margin_requirement_long: "25%",
        margin_requirement_short: "30%",
        shortable: true,
        easy_to_borrow: true,
        fractionable: true,
        ptp_no_exception: false,
        ptp_with_exception: false,
        ipo: false,
        has_options: true,
        options_late_close: false,
      },
      stats: {
        symbol: "AAPL",
        totalVolume: 45678900,
        avgVolume: 52000000,
        marketCap: "$2.8T",
        peRatio: 28.5,
        dividend: 0.96,
        yearHigh: 199.62,
        yearLow: 164.08,
        price: 258.02,
        change: 0.89,
        changePercent: 0.35,
      },
    },
    {
      asset: {
        id: "MSFT",
        class: "us_equity",
        exchange: "NASDAQ",
        symbol: "MSFT",
        name: "Microsoft Corporation",
        status: "active",
        tradable: true,
        marginable: true,
        maintenance_margin_requirement: 0.25,
        margin_requirement_long: "25%",
        margin_requirement_short: "30%",
        shortable: true,
        easy_to_borrow: true,
        fractionable: true,
        ptp_no_exception: false,
        ptp_with_exception: false,
        ipo: false,
        has_options: true,
        options_late_close: false,
      },
      stats: {
        symbol: "MSFT",
        totalVolume: 23456789,
        avgVolume: 28000000,
        marketCap: "$2.4T",
        peRatio: 25.8,
        dividend: 2.72,
        yearHigh: 384.3,
        yearLow: 309.45,
        price: 375.2,
        change: -1.85,
        changePercent: -0.49,
      },
    },
    {
      asset: {
        id: "GOOGL",
        class: "us_equity",
        exchange: "NASDAQ",
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        status: "active",
        tradable: true,
        marginable: true,
        maintenance_margin_requirement: 0.25,
        margin_requirement_long: "25%",
        margin_requirement_short: "30%",
        shortable: true,
        easy_to_borrow: true,
        fractionable: true,
        ptp_no_exception: false,
        ptp_with_exception: false,
        ipo: false,
        has_options: true,
        options_late_close: false,
      },
      stats: {
        symbol: "GOOGL",
        totalVolume: 18765432,
        avgVolume: 22000000,
        marketCap: "$1.6T",
        peRatio: 22.4,
        dividend: 0,
        yearHigh: 191.75,
        yearLow: 129.4,
        price: 167.85,
        change: 2.15,
        changePercent: 1.3,
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Asset Cards Demo
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockAssets.map(({ asset, stats }) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            stats={stats}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}
