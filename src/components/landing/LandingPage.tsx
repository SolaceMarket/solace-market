"use client";

import { CTASection } from "./sections/CTASection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { SecuritySection } from "./sections/SecuritySection";
import { WhyChooseSection } from "./sections/WhyChooseSection";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <HeroSection />
      {/* <FeaturesSection />
      <WhyChooseSection />
      <SecuritySection />
      <CTASection />
      <FooterSection /> */}
    </div>
  );
}
