import { getPortfolioById } from "@/data/portfolioService";
import { getHoldingsByPortfolioId } from "@/data/holdingsService";
import {
  getTransactionsByPortfolioId,
  getPortfolioStats,
} from "@/data/transactionsService";
import type {
  PortfolioSummary,
  PortfolioPerformance,
  AssetAllocation,
  HoldingWithAsset,
} from "@/data/portfolioTypes";

export const getPortfolioSummary = async (
  portfolioId: string,
  userId: string,
): Promise<PortfolioSummary | null> => {
  try {
    const [portfolio, holdings, recentTransactions, stats] = await Promise.all([
      getPortfolioById(portfolioId, userId),
      getHoldingsByPortfolioId(portfolioId),
      getTransactionsByPortfolioId(portfolioId, 10),
      getPortfolioStats(portfolioId),
    ]);

    if (!portfolio) {
      return null;
    }

    const performance = calculatePortfolioPerformance(holdings, stats);
    const allocation = calculateAssetAllocation(holdings);

    return {
      portfolio,
      holdings,
      recent_transactions: recentTransactions,
      performance,
      allocation,
    };
  } catch (error) {
    console.error("Error fetching portfolio summary:", error);
    throw error;
  }
};

function calculatePortfolioPerformance(
  holdings: HoldingWithAsset[],
  stats: {
    total_invested: number;
    total_sold: number;
    total_dividends: number;
    total_fees: number;
  },
): PortfolioPerformance {
  const currentValue = holdings.reduce(
    (sum, holding) => sum + holding.market_value,
    0,
  );
  const totalCost = holdings.reduce(
    (sum, holding) => sum + holding.quantity * holding.average_cost,
    0,
  );

  const totalReturn = currentValue - totalCost;
  const totalReturnPercent =
    totalCost === 0 ? 0 : (totalReturn / totalCost) * 100;

  const dayChange = holdings.reduce(
    (sum, holding) => sum + holding.day_change_value,
    0,
  );
  const dayChangePercent =
    currentValue === 0 ? 0 : (dayChange / (currentValue - dayChange)) * 100;

  // Mock data for week, month, year changes (in real app, you'd calculate from historical data)
  const weekChange = dayChange * 5; // Mock
  const weekChangePercent = dayChangePercent * 1.2; // Mock
  const monthChange = dayChange * 20; // Mock
  const monthChangePercent = dayChangePercent * 1.5; // Mock
  const yearChange = dayChange * 250; // Mock
  const yearChangePercent = dayChangePercent * 2; // Mock

  // Find best and worst performers
  const nonZeroHoldings = holdings.filter((h) => h.quantity > 0);
  const bestPerformer =
    nonZeroHoldings.length > 0
      ? nonZeroHoldings.reduce((best, current) =>
          current.unrealized_pl_percent > best.unrealized_pl_percent
            ? current
            : best,
        )
      : null;

  const worstPerformer =
    nonZeroHoldings.length > 0
      ? nonZeroHoldings.reduce((worst, current) =>
          current.unrealized_pl_percent < worst.unrealized_pl_percent
            ? current
            : worst,
        )
      : null;

  return {
    total_invested: stats.total_invested,
    current_value: currentValue,
    total_return: totalReturn,
    total_return_percent: totalReturnPercent,
    day_change: dayChange,
    day_change_percent: dayChangePercent,
    week_change: weekChange,
    week_change_percent: weekChangePercent,
    month_change: monthChange,
    month_change_percent: monthChangePercent,
    year_change: yearChange,
    year_change_percent: yearChangePercent,
    best_performer: bestPerformer
      ? {
          symbol: bestPerformer.symbol,
          name: bestPerformer.asset_name,
          return_percent: bestPerformer.unrealized_pl_percent,
        }
      : null,
    worst_performer: worstPerformer
      ? {
          symbol: worstPerformer.symbol,
          name: worstPerformer.asset_name,
          return_percent: worstPerformer.unrealized_pl_percent,
        }
      : null,
  };
}

function calculateAssetAllocation(
  holdings: HoldingWithAsset[],
): AssetAllocation[] {
  const totalValue = holdings.reduce(
    (sum, holding) => sum + holding.market_value,
    0,
  );

  if (totalValue === 0) {
    return [];
  }

  // Group by asset class
  const classMap = holdings.reduce(
    (acc, holding) => {
      const assetClass = holding.asset_class || "Other";

      if (!acc[assetClass]) {
        acc[assetClass] = {
          value: 0,
          count: 0,
        };
      }

      acc[assetClass].value += holding.market_value;
      acc[assetClass].count += 1;

      return acc;
    },
    {} as Record<string, { value: number; count: number }>,
  );

  // Convert to allocation array
  return Object.entries(classMap)
    .map(([category, data]) => ({
      category,
      value: data.value,
      percentage: (data.value / totalValue) * 100,
      count: data.count,
    }))
    .sort((a, b) => b.value - a.value);
}

// Mock function to simulate real-time price updates
export const updateHoldingPrices = async (
  portfolioId: string,
): Promise<void> => {
  // In a real application, this would:
  // 1. Fetch current market prices from a financial data API
  // 2. Update the holdings table with current prices
  // 3. Recalculate market values and P&L

  // For now, we'll just add some mock price movements
  const holdings = await getHoldingsByPortfolioId(portfolioId);

  for (const holding of holdings) {
    // Mock price change between -5% and +5%
    const priceChangePercent = (Math.random() - 0.5) * 0.1; // -5% to +5%
    const newPrice = holding.current_price * (1 + priceChangePercent);
    const newMarketValue = holding.quantity * newPrice;
    const unrealizedPl =
      newMarketValue - holding.quantity * holding.average_cost;
    const unrealizedPlPercent =
      holding.average_cost === 0
        ? 0
        : (unrealizedPl / (holding.quantity * holding.average_cost)) * 100;

    const dayChange = newMarketValue - holding.market_value;
    const dayChangePercent =
      holding.market_value === 0 ? 0 : (dayChange / holding.market_value) * 100;

    // Update holding in database (simplified)
    // In real app, you'd use a proper update function
    console.log(
      `Updated ${holding.symbol}: ${holding.current_price} -> ${newPrice}`,
    );
  }
};
