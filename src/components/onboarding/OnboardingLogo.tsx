"use client";

import { GlowEffect } from "@/components/ui";
import { SolaceLogo } from "@/components/ui/shared/SolaceLogo";

interface OnboardingLogoProps {
  isInitialized: boolean;
}

export function OnboardingLogo({ isInitialized }: OnboardingLogoProps) {
  return (
    <div className="mb-6">
      {isInitialized ? (
        <GlowEffect variant="logo" glowColor="emerald" intensity="normal">
          <SolaceLogo size={128} className="mx-auto" />
        </GlowEffect>
      ) : (
        <SolaceLogo size={128} className="mx-auto" />
      )}
    </div>
  );
}
