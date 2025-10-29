"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GlowEffect, IlluminationBackground } from "@/components/ui";
import { useSolana } from "@/components/web3/solana/SolanaProvider";
import { WalletConnectButton } from "@/components/web3/solana/wallet-connect-button";

export function Web3OnboardingPage() {
  const router = useRouter();
  const { isConnected } = useSolana();
  const [showWalletSelector, setShowWalletSelector] = useState(false);

  // Redirect to assets page when wallet is connected
  useEffect(() => {
    if (isConnected) {
      router.push("/assets-list");
    }
  }, [isConnected, router]);

  const handleConnectWallet = () => {
    setShowWalletSelector(true);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Illumination Background Component */}
      <IlluminationBackground glowTheme="mixed" particleCount="normal" />

      {/* Main content with enhanced glow effects */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md mx-auto">
        {/* Logo with subtle glow */}
        <div className="mb-6">
          <GlowEffect variant="logo" glowColor="emerald" intensity="normal">
            <Image
              src="/metadata/SolaceMarket-logo_256x256.ico"
              alt="Solace Market Logo"
              width={128}
              height={128}
              className="mx-auto"
            />
          </GlowEffect>
        </div>

        {/* Title with text glow */}
        <GlowEffect variant="text" glowColor="emerald" className="mb-6">
          <h1 className="text-4xl font-bold text-white">Solace.Market</h1>
        </GlowEffect>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-8">
          Trade Stocks, Bonds, Commodities & more!
        </p>

        {/* Privacy text */}
        <p className="text-lg text-gray-400 mb-4">Keep your privacy</p>

        {/* 24/7 text */}
        {/* <p className="text-lg text-gray-400 mb-4">Trade 24/7</p> */}

        {/* Use any asset as collateral text */}
        <p className="text-lg text-gray-400 mb-4">
          Use any asset as collateral
        </p>

        {/* Wallet text */}
        <p className="text-lg text-gray-400 mb-12">
          All directly from your wallet
        </p>

        {/* Connect Wallet Button with enhanced effects */}
        <div className="w-full">
          {!showWalletSelector ? (
            <GlowEffect variant="button" glowColor="emerald">
              <button
                type="button"
                onClick={handleConnectWallet}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Connect wallet
              </button>
            </GlowEffect>
          ) : (
            <GlowEffect variant="modal" glowColor="emerald">
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-lg p-6 border border-emerald-500/40 shadow-2xl">
                <h3 className="text-white text-lg font-semibold mb-4 text-center drop-shadow-sm">
                  Select a Wallet
                </h3>
                <div className="flex justify-center">
                  <div className="w-full max-w-xs">
                    <WalletConnectButton />
                  </div>
                </div>
                <p className="text-gray-400 text-sm text-center mt-4">
                  Choose your preferred Solana wallet to continue
                </p>
              </div>
            </GlowEffect>
          )}
        </div>
      </div>
    </div>
  );
}
