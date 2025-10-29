import type { AssetData } from "@/types/assets";

export interface ApiAsset {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  logo: string;
  category: "Stock" | "Crypto";
  market: string;
  description: string;
}

export interface ListAsset {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  logo: string;
  category: "Stock" | "Crypto";
}

// Central asset definitions - single source of truth
const baseAssets = [
  {
    id: "AAPL",
    symbol: "AAPL",
    name: "Apple Inc.",
    shortName: "Apple",
    price: "174.50",
    change: "+2.30",
    changePercent: "+1.34%",
    isPositive: true,
    logo: "apple",
    category: "Stock" as const,
    market: "NASDAQ",
    description:
      "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
  },
  {
    id: "GOOGL",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    shortName: "Alphabet",
    price: "175.43",
    change: "+1.24",
    changePercent: "+1.60%",
    isPositive: true,
    logo: "google",
    category: "Stock" as const,
    market: "NASDAQ",
    description:
      "Alphabet Inc. is a holding company that gives ambitious projects the resources, freedom, and focus to make their ideas happen.",
  },
  {
    id: "MSFT",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    shortName: "Microsoft",
    price: "415.26",
    change: "+5.80",
    changePercent: "+1.42%",
    isPositive: true,
    logo: "microsoft",
    category: "Stock" as const,
    market: "NASDAQ",
    description:
      "Microsoft Corporation develops and supports software, services, devices and solutions worldwide.",
  },
  {
    id: "BTC",
    symbol: "BTC",
    name: "Bitcoin",
    shortName: "Bitcoin",
    price: "65500.00",
    change: "+1250.00",
    changePercent: "+1.95%",
    isPositive: true,
    logo: "bitcoin",
    category: "Crypto" as const,
    market: "Crypto",
    description:
      "Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network.",
  },
  {
    id: "SOL",
    symbol: "SOL",
    name: "Solana",
    shortName: "Solana",
    price: "195.75",
    change: "+8.45",
    changePercent: "+4.51%",
    isPositive: true,
    logo: "solana",
    category: "Crypto" as const,
    market: "Crypto",
    description:
      "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today.",
  },
  {
    id: "TSLA",
    symbol: "TSLA",
    name: "Tesla Inc",
    shortName: "Tesla",
    price: "248.98",
    change: "-3.45",
    changePercent: "-1.37%",
    isPositive: false,
    logo: "tesla",
    category: "Stock" as const,
    market: "NASDAQ",
    description:
      "Tesla Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.",
  },
  {
    id: "ETH",
    symbol: "ETH",
    name: "Ethereum",
    shortName: "Ethereum",
    price: "2650.75",
    change: "+85.20",
    changePercent: "+3.32%",
    isPositive: true,
    logo: "ethereum",
    category: "Crypto" as const,
    market: "Crypto",
    description:
      "Ethereum is a decentralized platform that runs smart contracts: applications that run exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference.",
  },
];

// API format (with all fields)
export const getAllAssets = (): ApiAsset[] => {
  return baseAssets.map((asset) => ({
    id: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    price: asset.price,
    change: asset.change,
    changePercent: asset.changePercent,
    isPositive: asset.isPositive,
    logo: asset.logo,
    category: asset.category,
    market: asset.market,
    description: asset.description,
  }));
};

// List page format (simplified)
export const getListAssets = (): ListAsset[] => {
  return baseAssets.map((asset) => ({
    id: asset.id,
    symbol: asset.symbol,
    name: asset.shortName,
    price: `${asset.price} USD`,
    change: asset.changePercent,
    isPositive: asset.isPositive,
    logo: asset.logo,
    category: asset.category,
  }));
};

// Swap page format (as Record)
export const getSwapAssets = (): Record<string, AssetData> => {
  const result: Record<string, AssetData> = {};

  baseAssets.forEach((asset) => {
    result[asset.symbol] = {
      symbol: asset.symbol,
      name: asset.name,
      price: `${asset.price} USD`,
      change: asset.changePercent,
      isPositive: asset.isPositive,
      logo: asset.logo,
      description: asset.description,
    };
  });

  return result;
};

// Get single asset by symbol
export const getAssetBySymbol = (symbol: string): AssetData | null => {
  const asset = baseAssets.find(
    (a) => a.symbol.toUpperCase() === symbol.toUpperCase(),
  );
  if (!asset) return null;

  return {
    symbol: asset.symbol,
    name: asset.name,
    price: `${asset.price} USD`,
    change: asset.changePercent,
    isPositive: asset.isPositive,
    logo: asset.logo,
    description: asset.description,
  };
};

// Export base assets for any custom formatting needs
export { baseAssets };
