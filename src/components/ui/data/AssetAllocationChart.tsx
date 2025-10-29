import type { AssetAllocation } from "@/data/portfolioTypes";

interface AssetAllocationChartProps {
  allocation: AssetAllocation[];
}

export function AssetAllocationChart({
  allocation,
}: AssetAllocationChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Color palette for different asset classes
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-gray-500",
  ];

  if (allocation.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Asset Allocation
        </h3>
        <div className="text-center text-gray-500 py-8">
          <p>No assets to display allocation</p>
        </div>
      </div>
    );
  }

  const totalValue = allocation.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Asset Allocation
      </h3>

      {/* Pie Chart (Visual representation using CSS) */}
      <div className="mb-6">
        <div className="relative w-48 h-48 mx-auto">
          {/* Simple donut chart using CSS */}
          <div className="absolute inset-0 rounded-full bg-gray-200">
            {allocation.map((item, index) => {
              const angle = (item.percentage / 100) * 360;
              const rotation = allocation
                .slice(0, index)
                .reduce((sum, prev) => sum + (prev.percentage / 100) * 360, 0);

              return (
                <div
                  key={item.category}
                  className={`absolute inset-0 rounded-full ${colors[index % colors.length]} opacity-80`}
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((angle - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((angle - 90) * Math.PI) / 180)}%, 50% 50%)`,
                    transform: `rotate(${rotation}deg)`,
                  }}
                />
              );
            })}
          </div>

          {/* Center hole for donut effect */}
          <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalValue)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend and Details */}
      <div className="space-y-3">
        {allocation.map((item, index) => (
          <div
            key={item.category}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {item.category}
                </div>
                <div className="text-xs text-gray-500">
                  {item.count} {item.count === 1 ? "asset" : "assets"}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {formatCurrency(item.value)}
              </div>
              <div className="text-xs text-gray-500">
                {formatPercent(item.percentage)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Allocation Table Alternative for Better Accessibility */}
      <div className="mt-6 lg:hidden">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Allocation Breakdown
        </h4>
        <div className="space-y-2">
          {allocation.map((item, index) => (
            <div
              key={item.category}
              className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded ${colors[index % colors.length]}`}
                />
                <span className="text-sm text-gray-700">{item.category}</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatPercent(item.percentage)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diversification Score */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-blue-900">
              Diversification Score
            </div>
            <div className="text-xs text-blue-600">
              Based on asset class distribution
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-900">
              {calculateDiversificationScore(allocation)}/10
            </div>
            <div className="text-xs text-blue-600">
              {getDiversificationLabel(
                calculateDiversificationScore(allocation),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateDiversificationScore(allocation: AssetAllocation[]): number {
  if (allocation.length === 0) return 0;

  // Simple diversification score based on number of asset classes and distribution
  const numCategories = allocation.length;
  const maxPercentage = Math.max(...allocation.map((a) => a.percentage));

  // Score based on number of categories (more is better)
  const categoryScore = Math.min(numCategories * 2, 6); // Max 6 points for categories

  // Score based on distribution (less concentration is better)
  const distributionScore = Math.max(0, 4 - (maxPercentage - 25) / 10); // Max 4 points for distribution

  return Math.min(10, Math.round(categoryScore + distributionScore));
}

function getDiversificationLabel(score: number): string {
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Good";
  if (score >= 4) return "Moderate";
  return "Poor";
}
