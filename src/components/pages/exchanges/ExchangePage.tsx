import { EnhancedAssetsTable } from "@/components/ui/data/EnhancedAssetsTable";
import { ExchangeHeader } from "@/components/ui/data/ExchangeHeader";
import { MarketSentiment } from "@/components/ui/data/MarketSentiment";
import { NewsCard } from "@/components/ui/data/NewsCard";
import { QuickStats } from "@/components/ui/data/QuickStats";
import { RankingTable } from "@/components/ui/data/RankingTable";
import { StatCard } from "@/components/ui/data/StatCard";
import { ProgressBar } from "@/components/ui/forms/ProgressBar";
import { exchangeData, getExchangeNews } from "@/data/exchangeInfo";
import {
  getExchangeComparison,
  getExchangeStats,
} from "@/turso/tables/assets/exchangeStats";
import {
  defaultPagination,
  getAssetsByExchange,
  getTradableAssetsByExchange,
} from "@/turso/tables/assets/selectAssets";

export interface ExchangePageProps {
  name: string;
}

export async function ExchangePage({ name }: ExchangePageProps) {
  // Fetch all the data we need
  const [stats, comparison, tradableAssets, allAssets, news] =
    await Promise.all([
      getExchangeStats(name),
      getExchangeComparison(name),
      getTradableAssetsByExchange(name, defaultPagination),
      getAssetsByExchange(name, { limit: 20, offset: 0 }),
      getExchangeNews(name),
    ]);

  // Get exchange info (fallback to default if not found)
  const exchangeInfo = exchangeData[name] || {
    code: name,
    fullName: `${name} Exchange`,
    description: `The ${name} exchange is a financial marketplace for trading securities.`,
    logo: "/logos/default.png",
    website: `https://www.${name.toLowerCase()}.com`,
    founded: 1900,
    headquarters: "Not specified",
    socialMedia: {},
    marketCap: "Not available",
    tradingHours: {
      open: "09:30",
      close: "16:00",
      timezone: "ET",
    },
  };

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header with Logo, Description, and Social Media */}
        <ExchangeHeader
          exchangeInfo={exchangeInfo}
          currentRank={comparison.currentRank}
          totalExchanges={comparison.totalExchanges}
        />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Assets"
            value={formatNumber(stats.totalAssets)}
            subtitle="All listed securities"
            trend="neutral"
          />
          <StatCard
            title="Tradable Assets"
            value={formatNumber(stats.tradableAssets)}
            subtitle={`${formatPercentage(stats.tradabilityRate)} tradable`}
            trend="up"
          />
          <StatCard
            title="Marginable Assets"
            value={formatNumber(stats.marginableAssets)}
            subtitle={`${formatPercentage((stats.marginableAssets / stats.totalAssets) * 100)} of total`}
            trend="neutral"
          />
          <StatCard
            title="Shortable Assets"
            value={formatNumber(stats.shortableAssets)}
            subtitle={`${formatPercentage((stats.shortableAssets / stats.totalAssets) * 100)} of total`}
            trend="neutral"
          />
        </div>

        {/* Market Sentiment */}
        <div className="mb-8">
          <MarketSentiment exchangeName={name} />
        </div>

        {/* Asset Composition & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Asset Classes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Asset Classes
            </h3>
            <div className="space-y-4">
              {stats.assetClasses.map((assetClass) => (
                <div key={assetClass.class}>
                  <ProgressBar
                    value={assetClass.count}
                    max={stats.totalAssets}
                    label={`${assetClass.class} (${formatNumber(assetClass.count)})`}
                    color="blue"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Trading Features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Trading Features
            </h3>
            <div className="space-y-4">
              <ProgressBar
                value={stats.marginableAssets}
                max={stats.totalAssets}
                label={`Marginable (${formatNumber(stats.marginableAssets)})`}
                color="green"
              />
              <ProgressBar
                value={stats.shortableAssets}
                max={stats.totalAssets}
                label={`Shortable (${formatNumber(stats.shortableAssets)})`}
                color="red"
              />
              <ProgressBar
                value={stats.fractionableAssets}
                max={stats.totalAssets}
                label={`Fractionable (${formatNumber(stats.fractionableAssets)})`}
                color="yellow"
              />
              <ProgressBar
                value={stats.easyToBorrowAssets}
                max={stats.totalAssets}
                label={`Easy to Borrow (${formatNumber(stats.easyToBorrowAssets)})`}
                color="blue"
              />
            </div>
          </div>
        </div>

        {/* Exchange Rankings */}
        <div className="mb-8">
          <RankingTable rankings={comparison.rankings} currentExchange={name} />
        </div>

        {/* News Section */}
        <div className="mb-8">
          <NewsCard news={news} exchangeName={exchangeInfo.fullName} />
        </div>

        {/* Sidebar Stats */}
        <div className="mb-8">
          <QuickStats stats={stats} />
        </div>

        {/* Assets Tables */}
        <div className="space-y-8">
          {/* Tradable Assets */}
          <EnhancedAssetsTable
            assets={tradableAssets}
            title={`Tradable Assets (${formatNumber(stats.tradableAssets)} total)`}
          />

          {/* All Assets Sample */}
          <EnhancedAssetsTable
            assets={allAssets}
            title={`All Assets Sample (${formatNumber(stats.totalAssets)} total)`}
          />
        </div>

        {/* Market Insights */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Market Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatPercentage(stats.tradabilityRate)}
              </div>
              <div className="text-sm text-gray-600">Tradability Rate</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.tradabilityRate > 80
                  ? "Excellent"
                  : stats.tradabilityRate > 60
                    ? "Good"
                    : stats.tradabilityRate > 40
                      ? "Fair"
                      : "Poor"}{" "}
                liquidity
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(
                  (stats.marginableAssets / stats.totalAssets) * 100,
                )}
              </div>
              <div className="text-sm text-gray-600">Margin Availability</div>
              <div className="text-xs text-gray-500 mt-1">
                Assets available for margin trading
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatPercentage(
                  (stats.shortableAssets / stats.totalAssets) * 100,
                )}
              </div>
              <div className="text-sm text-gray-600">Short Availability</div>
              <div className="text-xs text-gray-500 mt-1">
                Assets available for short selling
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
