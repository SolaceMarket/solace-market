"use client";

import { Coins, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { SolaceLogo } from "@/components/ui/shared/SolaceLogo";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Calming background with "solace" theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/30 to-teal-900/20" />

      {/* Subtle background elements for trust/calm feeling */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Logo above brand name */}
        <div className="mb-4">
          <SolaceLogo size={64} className="mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Solace.Market
          </h1>
        </div>

        {/* Super short title */}
        <h2 className="text-xl md:text-2xl font-semibold text-teal-200 mb-6">
          Invest with Peace of Mind
        </h2>

        {/* Pain point solutions - better space utilization */}
        <div className="space-y-4 mb-8 max-w-md mx-auto">
          <div className="bg-slate-800/40 backdrop-blur-sm border border-teal-500/20 rounded-lg p-5 hover:border-teal-400/40 transition-all duration-300">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-7 h-7 text-teal-400 flex-shrink-0" />
              <div className="text-left">
                <h3 className="text-base text-white leading-tight">
                  Trade Stocks, Bonds, Crypto, Commodities & more!
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm border border-blue-500/20 rounded-lg p-5 hover:border-blue-400/40 transition-all duration-300">
            <div className="flex items-center gap-4">
              <Wallet className="w-7 h-7 text-blue-400 flex-shrink-0" />
              <div className="text-left">
                <h3 className="text-base text-white leading-tight">
                  No KYC - Just connect & trade
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-5 hover:border-emerald-400/40 transition-all duration-300">
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

        {/* General CTA button without arrow */}
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
