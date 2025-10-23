import type { Asset } from "@/alpaca/assets/Asset";

interface SimilarAssetsProps {
  assets: Asset[];
  currentSymbol: string;
}

export function SimilarAssets({ assets }: SimilarAssetsProps) {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Similar Assets</h3>
        <p className="text-sm text-gray-600">
          Other assets in the same class and exchange
        </p>
      </div>
      <div className="divide-y divide-gray-200">
        {assets.length > 0 ? (
          assets.map((asset) => (
            <a
              key={asset.id}
              href={`/assets/${asset.symbol}`}
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {asset.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {asset.symbol}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {asset.name || "No name available"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status, asset.tradable)}`}
                  >
                    {asset.status === "active" && asset.tradable
                      ? "Active"
                      : asset.status === "active" && !asset.tradable
                        ? "Delisting"
                        : "Inactive"}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-label="View asset"
                  >
                    <title>View asset</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Features */}
              <div className="mt-2 flex flex-wrap gap-1">
                {asset.marginable && (
                  <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">
                    M
                  </span>
                )}
                {asset.shortable && (
                  <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700">
                    S
                  </span>
                )}
                {asset.fractionable && (
                  <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
                    F
                  </span>
                )}
                {asset.easy_to_borrow && (
                  <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">
                    E
                  </span>
                )}
              </div>
            </a>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>No similar assets found</p>
          </div>
        )}
      </div>
      {assets.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <a
            href={`/assets?exchange=${assets[0]?.exchange}&class=${assets[0]?.class}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all similar assets →
          </a>
        </div>
      )}
    </div>
  );
}
