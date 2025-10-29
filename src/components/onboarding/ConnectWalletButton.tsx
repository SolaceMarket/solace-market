"use client";

import { GlowEffect } from "@/components/ui";

interface ConnectWalletButtonProps {
  isInitialized: boolean;
  onConnectWallet: () => void;
}

export function ConnectWalletButton({
  isInitialized,
  onConnectWallet,
}: ConnectWalletButtonProps) {
  const buttonContent = (
    <button
      type="button"
      onClick={onConnectWallet}
      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      Connect wallet
    </button>
  );

  return (
    <>
      {isInitialized ? (
        <GlowEffect variant="button" glowColor="emerald">
          {buttonContent}
        </GlowEffect>
      ) : (
        buttonContent
      )}
    </>
  );
}
