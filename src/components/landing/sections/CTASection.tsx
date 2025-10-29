"use client";

import { ArrowRight, Globe, Smartphone, Zap } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  const quickFeatures = [
    {
      icon: Smartphone,
      text: "Mobile-optimized interface",
    },
    {
      icon: Globe,
      text: "Global market access",
    },
    {
      icon: Zap,
      text: "Lightning-fast execution",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-emerald-900/20 via-slate-900 to-blue-900/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main CTA */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Take Control of
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Your Trading?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the future of private, flexible, and comprehensive trading.
              Start with any asset, trade across all markets, and keep your
              privacy intact.
            </p>
          </div>

          {/* Quick features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {quickFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.text}
                  className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2"
                >
                  <Icon className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300 text-sm">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/onboarding"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 group shadow-lg hover:shadow-emerald-500/25"
            >
              Start Trading Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/demo"
              className="border border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-slate-800/50"
            >
              Try Demo Mode
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="border-t border-slate-700 pt-8">
            <p className="text-sm text-gray-400 mb-6">
              Trusted by traders worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
              {/* Placeholder for partner logos or certifications */}
              <div className="text-gray-500 text-sm font-medium">
                SOC 2 Compliant
              </div>
              <div className="text-gray-500 text-sm font-medium">
                GDPR Compliant
              </div>
              <div className="text-gray-500 text-sm font-medium">
                256-bit Encryption
              </div>
              <div className="text-gray-500 text-sm font-medium">
                24/7 Support
              </div>
            </div>
          </div>

          {/* Final disclaimer */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Important Disclaimer:</strong> Trading stocks, bonds,
                commodities, and other financial instruments involves
                substantial risk of loss and is not suitable for all investors.
                The value of investments may go down as well as up. Past
                performance is not indicative of future results. This platform
                does not provide investment advice, and all trading decisions
                are your own responsibility. Please ensure you understand the
                risks involved and seek independent financial advice if
                necessary. Only trade with money you can afford to lose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
