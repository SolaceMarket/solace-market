import { Coins, TrendingUp, Wallet } from "lucide-react";

export const FEATURES = [
  {
    id: "trading",
    icon: TrendingUp,
    title: "Multi-Asset Trading",
    shortTitle: "Trade Stocks, Bonds, Crypto, Commodities & more!",
    description:
      "Access global markets including stocks, bonds, crypto, commodities, and more from one platform",
    color: "teal",
  },
  {
    id: "privacy",
    icon: Wallet,
    title: "Privacy First",
    shortTitle: "No KYC - Just connect & trade",
    description:
      "No KYC requirements, no personal data collection. Just connect your wallet and start trading instantly",
    color: "blue",
  },
  {
    id: "collateral",
    icon: Coins,
    title: "Revolutionary Collateral",
    shortTitle: "Use any asset as collateral",
    description:
      "Use any asset as collateral for trades. Maximize capital efficiency like never before",
    color: "emerald",
  },
] as const;

export type Feature = (typeof FEATURES)[number];
export type FeatureColor = Feature["color"];
