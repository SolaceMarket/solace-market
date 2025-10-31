"use client";

import { Web3AuthProvider } from "@web3auth/modal/react";
import { LandingPage } from "@/components/landing";
import { HomePage } from "@/components/pages/HomePage";
import { usePlatform } from "@/nextjs/hooks/usePlatform";
import web3AuthContextConfig from "@/web3auth/web3authContext";
import Web3Onboarding from "./web3-onboarding/page";

export default function Home() {
  const [isDetermined, platform] = usePlatform();
  if (!isDetermined || platform === "server") {
    return null;
  }

  return (
    <Web3AuthProvider config={web3AuthContextConfig}>
      {/* <HomePage /> */}
      {/* <Web3Onboarding /> */}
      <LandingPage />
    </Web3AuthProvider>
  );
}
