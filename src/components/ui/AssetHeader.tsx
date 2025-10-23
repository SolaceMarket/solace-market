import type { Asset } from "@/alpaca/assets/Asset";
import type { AssetStats } from "@/data/assetData";

interface AssetHeaderProps {
  asset: Asset;
  stats: AssetStats;
}

export function AssetHeader({ asset, stats }: AssetHeaderProps) {
  const isPositive = stats.change >= 0;
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatPercent = (percent: number) =>
    `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;

  const getStatusColor = (status: string, tradable: boolean) => {
    if (status === "active" && tradable) {
      return "bg-green-100 text-green-800";
    } else if (status === "active" && !tradable) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="p-8">
        <div className="flex items-start justify-between">
          {/* Main Asset Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {asset.symbol.slice(0, 2)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {asset.symbol}
                </h1>
                <p className="text-lg text-gray-600">
                  {asset.name || "Company Name"}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status, asset.tradable)}`}
                  >
                    {asset.status === "active" && asset.tradable
                      ? "Active"
                      : asset.status === "active" && !asset.tradable
                        ? "Delisting"
                        : "Inactive"}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">
                    {asset.exchange}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">{asset.class}</span>
                </div>
              </div>
            </div>

            {/* Asset Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {asset.marginable && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                  Marginable
                </span>
              )}
              {asset.shortable && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                  Shortable
                </span>
              )}
              {asset.fractionable && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                  Fractionable
                </span>
              )}
              {asset.easy_to_borrow && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700">
                  Easy to Borrow
                </span>
              )}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Market Cap
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {stats.marketCap}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">P/E Ratio</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {stats.peRatio.toFixed(1)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Dividend</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {formatPrice(stats.dividend)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">52W Range</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {formatPrice(stats.yearLow)} - {formatPrice(stats.yearHigh)}
                </dd>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {formatPrice(stats.price)}
            </div>
            <div
              className={`text-lg font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {formatPrice(Math.abs(stats.change))} (
              {formatPercent(stats.changePercent)})
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {isPositive ? "↗" : "↘"} Today
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2">
              <button
                type="button"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Buy
              </button>
              <button
                type="button"
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
