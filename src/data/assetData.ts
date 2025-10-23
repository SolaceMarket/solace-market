import { client } from "@/turso/database";
import type { Asset } from "@/alpaca/assets/Asset";

export interface AssetStats {
  symbol: string;
  totalVolume: number;
  avgVolume: number;
  marketCap: string;
  peRatio: number;
  dividend: number;
  yearHigh: number;
  yearLow: number;
  price: number;
  change: number;
  changePercent: number;
}

export interface AssetNews {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  source: string;
  url: string;
  sentiment: "positive" | "negative" | "neutral";
}

export interface AssetAnalytics {
  technicalIndicators: {
    rsi: number;
    sma20: number;
    sma50: number;
    sma200: number;
    momentum: "bullish" | "bearish" | "neutral";
  };
  analystRatings: {
    buy: number;
    hold: number;
    sell: number;
    average: number;
    targetPrice: number;
  };
  ownership: {
    institutional: number;
    insider: number;
    retail: number;
  };
}

export const getAssetBySymbol = async (
  symbol: string,
): Promise<Asset | null> => {
  const result = await client.execute(
    "SELECT * FROM assets WHERE symbol = ? LIMIT 1",
    [symbol],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0] as unknown as Asset;
};

export const getSimilarAssets = async (
  asset: Asset,
  limit: number = 5,
): Promise<Asset[]> => {
  const result = await client.execute(
    "SELECT * FROM assets WHERE class = ? AND exchange = ? AND symbol != ? AND tradable = 1 AND status = 'active' ORDER BY symbol LIMIT ?",
    [asset.class, asset.exchange, asset.symbol, limit],
  );

  return result.rows as unknown as Asset[];
};

export const getAssetStats = async (symbol: string): Promise<AssetStats> => {
  // Mock data for demonstration - in a real app, this would come from market data APIs
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockStats: Record<string, AssetStats> = {
    AAPL: {
      symbol: "AAPL",
      totalVolume: 45678900,
      avgVolume: 52000000,
      marketCap: "$2.8T",
      peRatio: 28.5,
      dividend: 0.96,
      yearHigh: 199.62,
      yearLow: 164.08,
      price: 189.75,
      change: 2.45,
      changePercent: 1.31,
    },
    MSFT: {
      symbol: "MSFT",
      totalVolume: 23456789,
      avgVolume: 28000000,
      marketCap: "$2.4T",
      peRatio: 25.8,
      dividend: 2.72,
      yearHigh: 384.3,
      yearLow: 309.45,
      price: 375.2,
      change: -1.85,
      changePercent: -0.49,
    },
  };

  return (
    mockStats[symbol] || {
      symbol,
      totalVolume: Math.floor(Math.random() * 100000000),
      avgVolume: Math.floor(Math.random() * 50000000),
      marketCap: "$0",
      peRatio: Math.random() * 50,
      dividend: Math.random() * 5,
      yearHigh: Math.random() * 500,
      yearLow: Math.random() * 100,
      price: Math.random() * 300,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
    }
  );
};

export const getAssetNews = async (symbol: string): Promise<AssetNews[]> => {
  // Mock news data
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockNews: AssetNews[] = [
    {
      id: "1",
      title: `${symbol} Reports Strong Q3 Earnings`,
      summary: `${symbol} exceeded analyst expectations with strong revenue growth and improved margins in the third quarter.`,
      publishedAt: "2024-10-15T09:30:00Z",
      source: "Financial Times",
      url: "https://example.com/news/1",
      sentiment: "positive",
    },
    {
      id: "2",
      title: `Analyst Upgrades ${symbol} to Buy Rating`,
      summary: `Major investment firm raises price target for ${symbol} citing strong fundamentals and growth prospects.`,
      publishedAt: "2024-10-14T14:20:00Z",
      source: "Reuters",
      url: "https://example.com/news/2",
      sentiment: "positive",
    },
    {
      id: "3",
      title: `${symbol} Announces New Product Launch`,
      summary: `The company unveils innovative new product line expected to drive future growth and market expansion.`,
      publishedAt: "2024-10-13T11:15:00Z",
      source: "Bloomberg",
      url: "https://example.com/news/3",
      sentiment: "positive",
    },
  ];

  return mockNews;
};

export const getAssetAnalytics = async (
  _symbol: string,
): Promise<AssetAnalytics> => {
  // Mock analytics data
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    technicalIndicators: {
      rsi: Math.random() * 100,
      sma20: Math.random() * 300,
      sma50: Math.random() * 300,
      sma200: Math.random() * 300,
      momentum: ["bullish", "bearish", "neutral"][
        Math.floor(Math.random() * 3)
      ] as "bullish" | "bearish" | "neutral",
    },
    analystRatings: {
      buy: Math.floor(Math.random() * 20),
      hold: Math.floor(Math.random() * 15),
      sell: Math.floor(Math.random() * 5),
      average: 3.5 + Math.random() * 1.5,
      targetPrice: Math.random() * 400,
    },
    ownership: {
      institutional: Math.random() * 80,
      insider: Math.random() * 20,
      retail: Math.random() * 60,
    },
  };
};
