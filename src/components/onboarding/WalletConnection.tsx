"use client";

import { ConnectWalletButton } from "./ConnectWalletButton";
import { WalletSelectorModal } from "./WalletSelectorModal";

interface WalletConnectionProps {
  isInitialized: boolean;
  showWalletSelector: boolean;
  onConnectWallet: () => void;
}

export function WalletConnection({
  isInitialized,
  showWalletSelector,
  onConnectWallet,
}: WalletConnectionProps) {
  return (
    <div className="w-full">
      {!showWalletSelector ? (
        <ConnectWalletButton
          isInitialized={isInitialized}
          onConnectWallet={onConnectWallet}
        />
      ) : (
        <WalletSelectorModal isInitialized={isInitialized} />
      )}
    </div>
  );
}
