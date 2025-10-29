"use client";

import { OnboardingFeatures } from "./OnboardingFeatures";
import { OnboardingLogo } from "./OnboardingLogo";
import { OnboardingTitle } from "./OnboardingTitle";
import { WalletConnection } from "./WalletConnection";

interface Web3OnboardingContentProps {
  isInitialized: boolean;
  showWalletSelector: boolean;
  onConnectWallet: () => void;
}

export function Web3OnboardingContent({
  isInitialized,
  showWalletSelector,
  onConnectWallet,
}: Web3OnboardingContentProps) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md mx-auto">
      <OnboardingLogo isInitialized={isInitialized} />

      <OnboardingTitle isInitialized={isInitialized} />

      <OnboardingFeatures />

      <WalletConnection
        isInitialized={isInitialized}
        showWalletSelector={showWalletSelector}
        onConnectWallet={onConnectWallet}
      />
    </div>
  );
}
