"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface TabBarProps {
  className?: string;
}

export function TabBar({ className = "" }: TabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine which tab is active based on current path
  const isTradeActive =
    pathname === "/assets-list" || pathname.startsWith("/assets/");
  const isWalletActive = pathname === "/wallet-portfolio";
  const isSettingsActive = pathname === "/settings";

  return (
    <div
      className={`h-full bg-slate-900/90 backdrop-blur border-t border-slate-700/50 p-4 flex items-center ${className}`}
    >
      <div className="flex justify-center space-x-8 max-w-md mx-auto w-full">
        {/* Trade Tab */}
        <button
          type="button"
          onClick={() => router.push("/assets-list")}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            isTradeActive ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
        >
          <Image
            src="/trade.svg"
            alt="Trade"
            width={32}
            height={32}
            className={`w-8 h-8 brightness-0 invert ${
              isTradeActive ? "" : "opacity-60"
            }`}
          />
        </button>

        {/* Wallet Tab */}
        <button
          type="button"
          onClick={() => router.push("/wallet-portfolio")}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            isWalletActive ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
        >
          <Image
            src="/wallet.svg"
            alt="Wallet"
            width={32}
            height={32}
            className={`w-8 h-8 brightness-0 invert ${
              isWalletActive ? "" : "opacity-60"
            }`}
          />
        </button>

        {/* Settings Tab */}
        <button
          type="button"
          onClick={() => router.push("/settings")}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            isSettingsActive ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
        >
          <Image
            src="/settings.svg"
            alt="Settings"
            width={32}
            height={32}
            className={`w-8 h-8 brightness-0 invert ${
              isSettingsActive ? "" : "opacity-60"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
