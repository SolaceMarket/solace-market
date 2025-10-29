"use client";

import { useState } from "react";
import { Web3OnboardingContent } from "@/components/onboarding";
import { IlluminationBackground } from "@/components/ui";
import { useSolana } from "@/components/web3/solana/SolanaProvider";
import { useInitialization, useWalletRedirect } from "@/hooks";

export function Web3OnboardingPage() {
  const { isConnected } = useSolana();
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const { isInitialized } = useInitialization();

  useWalletRedirect({ isConnected });

  const handleConnectWallet = () => {
    setShowWalletSelector(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Always render background immediately for smoother experience */}
      <IlluminationBackground glowTheme="mixed" particleCount="normal" />

      <Web3OnboardingContent
        isInitialized={isInitialized}
        showWalletSelector={showWalletSelector}
        onConnectWallet={handleConnectWallet}
      />
    </div>
  );
}
