"use client";

import {
  ArrowUpDown,
  BarChart3,
  Building2,
  Filter,
  Globe,
  Wallet,
  Zap,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: "Use Any Asset as Collateral",
      description:
        "Revolutionary feature no other exchange offers: Use your stocks, bonds, or commodities as collateral for trades.",
      benefits: [
        "Stocks as collateral for crypto trades",
        "No need to sell existing positions",
        "Maximize capital efficiency",
      ],
    },
    {
      icon: Filter,
      title: "Smart Routing Technology",
      description:
        "No need to swap through multiple assets. Our smart routing finds the best path for your trades automatically.",
      benefits: [
        "Direct asset-to-asset trading",
        "Optimal price execution",
        "Reduced transaction costs",
      ],
    },
    {
      icon: Wallet,
      title: "Wallet-First Trading",
      description:
        "Connect your wallet and start trading immediately. No KYC, no personal information required.",
      benefits: [
        "Complete privacy protection",
        "Instant access to markets",
        "Secure wallet integration",
      ],
    },
    {
      icon: BarChart3,
      title: "Portfolio Analytics",
      description:
        "Comprehensive tools to track performance, analyze risk, and make informed decisions.",
      benefits: [
        "Real-time metrics",
        "Risk assessment",
        "Performance tracking",
      ],
    },
    {
      icon: Zap,
      title: "Lightning Fast Execution",
      description:
        "Execute trades quickly with optimized order routing and minimal latency.",
      benefits: [
        "Sub-second execution",
        "Smart order routing",
        "Minimal slippage",
      ],
    },
    {
      icon: Building2,
      title: "Institutional Grade Security",
      description:
        "Bank-level security protocols protect your assets and trading data at all times.",
      benefits: ["Multi-layer encryption", "Cold storage", "Audit trails"],
    },
  ];

  return (
    <section className="py-20 bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Built for modern traders who demand flexibility, security, and
            comprehensive market access.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 hover:border-emerald-500/30 transition-all duration-300 group"
              >
                <div className="mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="space-y-2">
                  {feature.benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center text-sm text-emerald-400"
                    >
                      <ArrowUpDown className="w-4 h-4 mr-2 rotate-45" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border border-emerald-500/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Trading Experience?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of traders who have already discovered the power of
              our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Trading Now
              </button>
              <button
                type="button"
                className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
