import type { Asset } from "@/alpaca/assets/Asset";
import type { AssetStats } from "@/data/assetData";

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

  // Generate a logo placeholder for the asset
  const getAssetLogo = (symbol: string) => {
    if (symbol === "AAPL") {
      return (
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            aria-label="Apple logo"
          >
            <title>Apple Inc. Logo</title>
            <path
              d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"
              fill="black"
            />
          </svg>
        </div>
      );
    }

    // For other assets, use initials
    const initials = symbol.slice(0, 2);
    return (
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-xl font-bold text-black">{initials}</span>
      </div>
    );
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
        <div className="flex-shrink-0">{getAssetLogo(asset.symbol)}</div>

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
