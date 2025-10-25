import {
  getAssetBySymbol,
  getSimilarAssets,
  getAssetStats,
  getAssetNews,
  getAssetAnalytics,
} from "@/data/assetData";
import { AssetHeader } from "@/components/ui/AssetHeader";
import { TechnicalAnalysis } from "@/components/ui/TechnicalAnalysis";
import { AssetNewsCard } from "@/components/ui/AssetNewsCard";
import { SimilarAssets } from "@/components/ui/SimilarAssets";
import { StatCard } from "@/components/ui/StatCard";

export interface AssetPageProps {
  symbol: string;
}

export async function AssetPage({ symbol }: AssetPageProps) {
  // Fetch asset data
  const asset = await getAssetBySymbol(symbol.toUpperCase());

  if (!asset) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Asset Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The asset "{symbol}" could not be found in our database.
            </p>
            <a
              href="/assets"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse All Assets
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Fetch all related data
  const [stats, news, analytics, similarAssets] = await Promise.all([
    getAssetStats(symbol),
    getAssetNews(symbol),
    getAssetAnalytics(symbol),
    getSimilarAssets(asset, 5),
  ]);

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asset Header */}
        <AssetHeader asset={asset} stats={stats} />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Volume"
            value={formatNumber(stats.totalVolume)}
            subtitle={`Avg: ${formatNumber(stats.avgVolume)}`}
            trend="neutral"
          />
          <StatCard
            title="Market Cap"
            value={stats.marketCap}
            subtitle="Total value"
            trend="up"
          />
          <StatCard
            title="P/E Ratio"
            value={stats.peRatio.toFixed(1)}
            subtitle="Price to earnings"
            trend="neutral"
          />
          <StatCard
            title="Dividend Yield"
            value={`$${stats.dividend.toFixed(2)}`}
            subtitle="Annual dividend"
            trend="up"
          />
        </div>
        {/* Technical Analysis */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Technical Analysis
          </h2>
          <TechnicalAnalysis analytics={analytics} />
        </div>
        {/* News and Similar Assets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* News Section */}
          <div className="lg:col-span-2">
            <AssetNewsCard news={news} symbol={symbol} />
          </div>

          {/* Similar Assets Sidebar */}
          <div>
            <SimilarAssets assets={similarAssets} currentSymbol={symbol} />
          </div>
        </div>
        {/* Asset Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Asset Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Asset ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">
                {asset.id}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Exchange</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a
                  href={`/exchanges/${asset.exchange}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {asset.exchange}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Asset Class</dt>
              <dd className="mt-1 text-sm text-gray-900">{asset.class}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    asset.status === "active" && asset.tradable
                      ? "bg-green-100 text-green-800"
                      : asset.status === "active" && !asset.tradable
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {asset.status === "active" && asset.tradable
                    ? "Active Trading"
                    : asset.status === "active" && !asset.tradable
                      ? "Delisting"
                      : "Inactive"}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Margin Requirement
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {asset.maintenance_margin_requirement}%
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Features</dt>
              <dd className="mt-1 flex flex-wrap gap-1">
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
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
