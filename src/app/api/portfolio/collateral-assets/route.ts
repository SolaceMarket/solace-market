import { type NextRequest, NextResponse } from "next/server";
import { getSwapAssets } from "@/data/mockAssets";

// Mock portfolio data with collateral-eligible assets
const mockPortfolioAssets = {
  SOL: {
    balance: 15.5,
    usdValue: 2325.5,
    canUseAsCollateral: true,
    collateralRatio: 0.8, // 80% loan-to-value ratio
  },
  USDC: {
    balance: 1250.75,
    usdValue: 1250.75,
    canUseAsCollateral: true,
    collateralRatio: 0.95, // 95% loan-to-value ratio
  },
  BTC: {
    balance: 0.05,
    usdValue: 3200.0,
    canUseAsCollateral: true,
    collateralRatio: 0.75, // 75% loan-to-value ratio
  },
  ETH: {
    balance: 1.2,
    usdValue: 3600.0,
    canUseAsCollateral: true,
    collateralRatio: 0.8, // 80% loan-to-value ratio
  },
  AAPL: {
    balance: 5,
    usdValue: 850.0,
    canUseAsCollateral: false, // Stocks typically can't be used as collateral for crypto
    collateralRatio: 0,
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";

    // Get all asset data
    const allAssets = getSwapAssets();

    // Filter portfolio assets that can be used as collateral
    const collateralAssets = Object.entries(mockPortfolioAssets)
      .filter(([symbol, portfolioData]) => {
        const matchesSearch =
          symbol.toLowerCase().includes(search) ||
          allAssets[symbol]?.name.toLowerCase().includes(search);
        return (
          portfolioData.canUseAsCollateral &&
          matchesSearch &&
          portfolioData.balance > 0
        );
      })
      .map(([symbol, portfolioData]) => ({
        ...allAssets[symbol],
        symbol,
        balance: portfolioData.balance,
        usdValue: portfolioData.usdValue,
        collateralRatio: portfolioData.collateralRatio,
        maxCollateralValue:
          portfolioData.usdValue * portfolioData.collateralRatio,
      }))
      .sort((a, b) => b.usdValue - a.usdValue); // Sort by USD value descending

    return NextResponse.json({
      success: true,
      assets: collateralAssets,
      totalCollateralValue: collateralAssets.reduce(
        (sum, asset) => sum + asset.maxCollateralValue,
        0,
      ),
    });
  } catch (error) {
    console.error("Error fetching collateral assets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch collateral assets" },
      { status: 500 },
    );
  }
}
