import type { AssetAnalytics } from "@/data/assetData";

interface TechnicalAnalysisProps {
  analytics: AssetAnalytics;
}

export function TechnicalAnalysis({ analytics }: TechnicalAnalysisProps) {
  const { technicalIndicators, analystRatings, ownership } = analytics;

  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return "text-red-600 bg-red-100";
    if (rsi < 30) return "text-green-600 bg-green-100";
    return "text-yellow-600 bg-yellow-100";
  };

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case "bullish":
        return "🚀";
      case "bearish":
        return "📉";
      default:
        return "➡️";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Technical Indicators */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Technical Indicators
        </h3>

        <div className="space-y-4">
          {/* RSI */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">RSI (14)</span>
            <span
              className={`px-2 py-1 rounded-full text-sm font-semibold ${getRSIColor(technicalIndicators.rsi)}`}
            >
              {technicalIndicators.rsi.toFixed(1)}
            </span>
          </div>

          {/* Moving Averages */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">SMA 20</span>
              <span className="text-sm font-medium">
                ${technicalIndicators.sma20.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">SMA 50</span>
              <span className="text-sm font-medium">
                ${technicalIndicators.sma50.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">SMA 200</span>
              <span className="text-sm font-medium">
                ${technicalIndicators.sma200.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Momentum */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Momentum
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {getMomentumIcon(technicalIndicators.momentum)}
                </span>
                <span className="text-sm font-semibold capitalize">
                  {technicalIndicators.momentum}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analyst Ratings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Analyst Ratings
        </h3>

        <div className="text-center mb-4">
          <div
            className={`text-3xl font-bold ${getRatingColor(analystRatings.average)}`}
          >
            {analystRatings.average.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Average Rating</div>
          <div className="text-sm text-gray-500">Out of 5.0</div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Buy</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${(analystRatings.buy / (analystRatings.buy + analystRatings.hold + analystRatings.sell)) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium">{analystRatings.buy}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Hold</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${(analystRatings.hold / (analystRatings.buy + analystRatings.hold + analystRatings.sell)) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium">{analystRatings.hold}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Sell</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${(analystRatings.sell / (analystRatings.buy + analystRatings.hold + analystRatings.sell)) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium">{analystRatings.sell}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 mt-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              ${analystRatings.targetPrice.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Average Target Price</div>
          </div>
        </div>
      </div>

      {/* Ownership Structure */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ownership Structure
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Institutional</span>
              <span className="text-sm font-medium">
                {ownership.institutional.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${ownership.institutional}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Insider</span>
              <span className="text-sm font-medium">
                {ownership.insider.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${ownership.insider}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Retail</span>
              <span className="text-sm font-medium">
                {ownership.retail.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${ownership.retail}%` }}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 mt-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">
              Data as of latest filing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
