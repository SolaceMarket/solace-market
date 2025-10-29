interface MarketSentimentProps {
  exchangeName: string;
}

export function MarketSentiment({ exchangeName }: MarketSentimentProps) {
  // Mock sentiment data (in a real app, this would come from market data APIs)
  const sentimentData = {
    NYSE: { score: 85, trend: "bullish", volume: "+12%" },
    NASDAQ: { score: 78, trend: "bullish", volume: "+8%" },
    ARCA: { score: 72, trend: "neutral", volume: "+5%" },
    OTC: { score: 65, trend: "bearish", volume: "-2%" },
  };

  const sentiment = sentimentData[
    exchangeName as keyof typeof sentimentData
  ] || {
    score: 70,
    trend: "neutral",
    volume: "0%",
  };

  const getSentimentColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "bullish":
        return "📈";
      case "bearish":
        return "📉";
      default:
        return "➡️";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Market Sentiment
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sentiment Score */}
        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold ${getSentimentColor(sentiment.score)}`}
          >
            {sentiment.score}
          </div>
          <div className="mt-2 text-sm text-gray-600">Sentiment Score</div>
          <div className="text-xs text-gray-500">Out of 100</div>
        </div>

        {/* Market Trend */}
        <div className="text-center">
          <div className="text-4xl mb-2">{getTrendIcon(sentiment.trend)}</div>
          <div className="text-lg font-semibold text-gray-900 capitalize">
            {sentiment.trend}
          </div>
          <div className="text-sm text-gray-600">Market Trend</div>
        </div>

        {/* Volume Change */}
        <div className="text-center">
          <div
            className={`text-2xl font-bold ${
              sentiment.volume.startsWith("+")
                ? "text-green-600"
                : sentiment.volume.startsWith("-")
                  ? "text-red-600"
                  : "text-gray-600"
            }`}
          >
            {sentiment.volume}
          </div>
          <div className="text-sm text-gray-600">Volume Change</div>
          <div className="text-xs text-gray-500">vs. Yesterday</div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">+2.3%</div>
            <div className="text-xs text-gray-500">Today's Gain</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">156M</div>
            <div className="text-xs text-gray-500">Volume</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">2,847</div>
            <div className="text-xs text-gray-500">Active Stocks</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">98.2%</div>
            <div className="text-xs text-gray-500">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
}
