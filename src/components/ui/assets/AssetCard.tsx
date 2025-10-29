import type { Asset } from "@/alpaca/assets/Asset";
import type { AssetStats } from "@/data/assetData";
import { AssetLogo } from "../shared/AssetLogo";

interface AssetCardProps {
  asset: Asset;
  stats: AssetStats;
  className?: string;
}

export function AssetCard({ asset, stats, className = "" }: AssetCardProps) {
  const isPositive = stats.change >= 0;
  const formatPrice = (price: number) =>
    `${price.toFixed(2).replace(".", ",")} USD`;
  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2).replace(".", ",")}(${sign}${changePercent.toFixed(2).replace(".", ",")}%)`;
  };

  return (
    <div
      className={`
        relative p-6 rounded-2xl overflow-hidden 
        border-2 border-[#165336]
        ${className}
      `}
      style={{
        background:
          "linear-gradient(135deg, #1e3a8a 0%, #065f46 80%, #047857 100%)",
      }}
    >
      {/* Decorative dots pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, #10b981 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 flex items-center space-x-4">
        {/* Asset Logo */}
        <div className="flex-shrink-0">
          <AssetLogo
            src={asset.symbol === "AAPL" ? "/logos/apple.svg" : null}
            alt={`${asset.symbol} logo`}
            className="w-16 h-16"
          />
        </div>

        {/* Asset Info */}
        <div className="flex-1 min-w-0">
          <div className="text-white">
            <h3 className="text-xl font-bold mb-1">${asset.symbol}</h3>
            <p className="text-gray-200 text-sm mb-3">{asset.name}</p>
            <div className="text-2xl font-bold mb-1">
              {formatPrice(stats.price)}
            </div>
            <div
              className={`text-lg font-semibold ${
                isPositive ? "text-orange-400" : "text-red-400"
              }`}
            >
              {formatChange(stats.change, stats.changePercent)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
