import { Coins, TrendingUp, Wallet } from "lucide-react";

export const FEATURES = [
  {
    showIcon: false,
    id: "trading",
    icon: TrendingUp,
    title: "Trade Everything",
    subtitle: "Stocks, Bonds, Crypto & more",
    shortTitle: "Trade Stocks, Bonds, Crypto, Commodities & more!",
    description:
      "Access global markets including stocks, bonds, crypto, commodities, and more from one platform",
    color: "teal",
    logos: [
      { src: "/logos/apple.svg", alt: "Apple", name: "AAPL" },
      { src: "/logos/microsoft.svg", alt: "Microsoft", name: "MSFT" },
      { src: "/logos/tesla_motors.svg", alt: "Tesla Motors", name: "TSLA" },
      { src: "/logos/google.svg", alt: "Google", name: "GOOGL" },
      { src: "/logos/bitcoin.svg", alt: "Bitcoin", name: "BTC" },
      { src: "/logos/solana.svg", alt: "Solana", name: "SOL" },
    ],
  },
  {
    showIcon: true,
    id: "privacy",
    icon: Wallet,
    title: "No KYC",
    subtitle: "Just connect & trade",
    shortTitle: "No KYC - Just connect & trade",
    description:
      "No KYC to start trading. Just connect your wallet and start trading instantly",
    color: "blue",
  },
  {
    showIcon: true,
    id: "collateral",
    icon: Coins,
    title: "Unlimited Collateral",
    subtitle: "Use any asset for leveral",
    shortTitle: "Use any asset as collateral for leverage",
    description:
      "Use any asset as collateral for trades. Maximize capital efficiency like never before",
    color: "emerald",
  },
] as const;

export type Feature = (typeof FEATURES)[number];
export type FeatureColor = Feature["color"];
