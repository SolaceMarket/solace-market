"use client";

import { ArrowRight, Shield, TrendingUp, Wallet } from "lucide-react";
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
        {/* Logo */}
        <div className="mb-6">
          <SolaceLogo size={64} className="mx-auto mb-4" />
        </div>

        {/* Brand name */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
          Solace.Market
        </h1>

        {/* Super short title */}
        <h2 className="text-xl md:text-2xl font-semibold text-teal-200 mb-4">
          Trade with Peace of Mind
        </h2>

        {/* Very short subtitle */}
        <p className="text-base md:text-lg text-gray-300 mb-8 max-w-md mx-auto">
          Connect your wallet. Trade instantly. Stay private.
        </p>

        {/* Pain point solutions - compact mobile design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="bg-slate-800/40 backdrop-blur-sm border border-teal-500/20 rounded-lg p-4 hover:border-teal-400/40 transition-all duration-300">
            <Wallet className="w-6 h-6 text-teal-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white mb-1">No KYC</h3>
            <p className="text-xs text-gray-400">Just connect & trade</p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm border border-blue-500/20 rounded-lg p-4 hover:border-blue-400/40 transition-all duration-300">
            <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white mb-1">Private</h3>
            <p className="text-xs text-gray-400">Your data stays yours</p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-4 hover:border-emerald-400/40 transition-all duration-300">
            <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white mb-1">24/7</h3>
            <p className="text-xs text-gray-400">Always accessible</p>
          </div>
        </div>

        {/* Single CTA button */}
        <div className="mb-6">
          <Link
            href="/onboarding"
            className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 group shadow-lg hover:shadow-teal-500/25 w-fit mx-auto"
          >
            Start Trading
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Trust message */}
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          Join thousands who trust Solace for secure, private trading
        </p>
      </div>
    </section>
  );
}
