"use client";

import Image from "next/image";
import type { AssetData } from "@/types/assets";

interface AssetInfoHeaderProps {
  asset: AssetData;
  embedded?: boolean;
}

function getAssetLogo(
  logoType: string,
  width: number = 64,
  height: number = 64,
) {
  switch (logoType) {
    case "apple":
      return (
        <Image
          src="/logos/apple.svg"
          alt="Apple Logo"
          {...{ width, height }}
          className="w-16 h-16"
        />
      );
    case "bitcoin":
      return (
        <Image
          src="/logos/bitcoin.svg"
          alt="Bitcoin Logo"
          {...{ width, height }}
          className="w-16 h-16"
        />
      );
    case "microsoft":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-16 h-16"
          aria-label="Microsoft Logo"
        >
          <title>Microsoft Logo</title>
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M13 1h10v10H13z" />
          <path fill="#05a6f0" d="M1 13h10v10H1z" />
          <path fill="#ffba08" d="M13 13h10v10H13z" />
        </svg>
      );
    case "google":
      return (
        <svg viewBox="0 0 24 24" className="w-16 h-16" aria-label="Google Logo">
          <title>Google Logo</title>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      );
    case "solana":
      return (
        <Image
          src="/logos/solana.svg"
          alt="Solana Logo"
          {...{ width, height }}
          className="w-16 h-16"
        />
      );
    default:
      return (
        <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          ?
        </div>
      );
  }
}

export function AssetInfoHeader({ asset, embedded = false }: AssetInfoHeaderProps) {
  return (
    <div className={embedded ? "" : "p-6 border-b border-slate-700"}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          {getAssetLogo(asset.logo)}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{asset.name}</h2>
          <p className="text-gray-400">{asset.symbol}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <span className="text-3xl font-bold text-white">{asset.price}</span>
        <span
          className={`text-lg font-semibold ${
            asset.isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {asset.change}
        </span>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">
        {asset.description}
      </p>
    </div>
  );
}
