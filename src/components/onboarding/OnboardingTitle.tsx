"use client";

import { GlowEffect } from "@/components/ui";

interface OnboardingTitleProps {
  isInitialized: boolean;
}

export function OnboardingTitle({ isInitialized }: OnboardingTitleProps) {
  return (
    <>
      {isInitialized ? (
        <GlowEffect variant="text" glowColor="emerald" className="mb-6">
          <h1 className="text-4xl font-bold text-white">Solace.Market</h1>
        </GlowEffect>
      ) : (
        <h1 className="text-4xl font-bold text-white mb-6">Solace.Market</h1>
      )}
    </>
  );
}
