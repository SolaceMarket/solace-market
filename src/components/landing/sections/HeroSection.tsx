"use client";

import { Coins, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { GlowEffect, IlluminationBackground } from "@/components/ui";
import { SolaceLogo } from "@/components/ui/shared/SolaceLogo";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Illumination Background Component */}
      <IlluminationBackground glowTheme="mixed" particleCount="normal" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Logo above brand name with subtle glow */}
        <div className="mb-4">
          <GlowEffect variant="logo" glowColor="emerald" intensity="subtle">
            <SolaceLogo size={64} className="mx-auto mb-3 md:w-20 md:h-20" />
          </GlowEffect>
          <GlowEffect variant="text" glowColor="emerald">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Solace.Market
            </h1>
          </GlowEffect>
        </div>

        {/* Super short title with glow */}
        <GlowEffect variant="text" glowColor="emerald" className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-teal-200">
            Invest with Peace of Mind
          </h2>
        </GlowEffect>

        {/* Pain point solutions - responsive layout */}
        <div className="mb-8">
          {/* Mobile: Vertical stack */}
          <div className="md:hidden space-y-4 max-w-md mx-auto">
            <div className="bg-slate-800/20 backdrop-blur-sm border border-teal-500/20 rounded-lg p-5 hover:border-teal-400/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-7 h-7 text-teal-400 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-base text-white leading-tight">
                    Trade Stocks, Bonds, Crypto, Commodities & more!
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/20 backdrop-blur-sm border border-blue-500/20 rounded-lg p-5 hover:border-blue-400/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <Wallet className="w-7 h-7 text-blue-400 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-base text-white leading-tight">
                    No KYC - Just connect & trade
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/20 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-5 hover:border-emerald-400/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <Coins className="w-7 h-7 text-emerald-400 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-base text-white leading-tight">
                    Use any asset as collateral
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Horizontal grid with subtitles */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-800/20 backdrop-blur-sm border border-teal-500/20 rounded-lg p-6 hover:border-teal-400/40 transition-all duration-300 text-center">
              <TrendingUp className="w-8 h-8 text-teal-400 mx-auto mb-4" />
              <h3 className="text-lg text-white mb-2">Multi-Asset Trading</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Access global markets including stocks, bonds, crypto,
                commodities, and more from one platform
              </p>
            </div>

            <div className="bg-slate-800/20 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 hover:border-blue-400/40 transition-all duration-300 text-center">
              <Wallet className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg text-white mb-2">Privacy First</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                No KYC requirements, no personal data collection. Just connect
                your wallet and start trading instantly
              </p>
            </div>

            <div className="bg-slate-800/20 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-6 hover:border-emerald-400/40 transition-all duration-300 text-center">
              <Coins className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg text-white mb-2">
                Revolutionary Collateral
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Use any asset as collateral for trades. Maximize capital
                efficiency like never before
              </p>
            </div>
          </div>
        </div>

        {/* General CTA button without glow */}
        <div className="mb-6">
          <Link
            href="/onboarding"
            className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-16 py-5 rounded-xl font-semibold text-xl transition-all duration-300 shadow-xl hover:shadow-teal-500/30 w-fit mx-auto block"
          >
            Get Started
          </Link>
        </div>

        {/* Trust message */}
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          Join thousands who trust Solace for secure, private trading
        </p>
      </div>
    </section>
  );
}
