import { GlowEffect } from "@/components/ui";
import { SolaceLogo } from "@/components/ui/shared/SolaceLogo";

export function HeroHeader() {
  return (
    <>
      {/* Logo above brand name with subtle glow */}
      <div className="mb-4">
        <GlowEffect variant="logo" glowColor="emerald" intensity="subtle">
          <SolaceLogo size={80} className="mx-auto mb-3 md:w-24 md:h-24" />
        </GlowEffect>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Solace.Market
        </h1>
      </div>

      {/* Super short title with glow */}
      <GlowEffect variant="text" glowColor="emerald" className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-300">
          Invest with Peace of Mind
        </h2>
      </GlowEffect>
    </>
  );
}
