"use client";

import { GlowEffect } from "@/components/ui";
import { WalletConnectButton } from "@/components/web3/solana/wallet-connect-button";

interface WalletSelectorModalProps {
  isInitialized: boolean;
}

export function WalletSelectorModal({
  isInitialized,
}: WalletSelectorModalProps) {
  const modalContent = (
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
  );

  return (
    <>
      {isInitialized ? (
        <GlowEffect variant="modal" glowColor="emerald">
          {modalContent}
        </GlowEffect>
      ) : (
        modalContent
      )}
    </>
  );
}
