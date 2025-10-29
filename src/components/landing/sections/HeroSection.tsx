"use client";

import { IlluminationBackground } from "@/components/ui";
import { usePlatform } from "@/nextjs/hooks/usePlatform";
import {
  CTAButton,
  FeaturesGrid,
  HeroHeader,
  TrustMessage,
} from "../components";

export function HeroSection() {
  const [, platform] = usePlatform();

  // For SSR (server platform), always render desktop version for better SEO
  // For client, use responsive classes
  const shouldShowDesktopOnly = platform === "server";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Illumination Background Component */}
      <IlluminationBackground glowTheme="mixed" particleCount="abundant" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <HeroHeader />

        <FeaturesGrid shouldShowDesktopOnly={shouldShowDesktopOnly} />

        <CTAButton />

        <TrustMessage />
      </div>
    </section>
  );
}
