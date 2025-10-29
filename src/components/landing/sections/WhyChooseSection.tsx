"use client";

import {
  Clock,
  DollarSign,
  Lock,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";

export function WhyChooseSection() {
  const reasons = [
    {
      icon: Lock,
      title: "Complete Privacy Control",
      subtitle: "Your data, your choice",
      description:
        "Traditional brokers track and monetize your trading data. We believe your financial privacy should be protected, not exploited.",
      points: [
        "No data selling to third parties",
        "Encrypted communications",
        "Anonymous trading options",
        "GDPR compliant infrastructure",
      ],
    },
    {
      icon: DollarSign,
      title: "Revolutionary Collateral System",
      subtitle: "First exchange to offer this",
      description:
        "Use your Web2 assets like stocks and bonds as collateral for Web3 trades. No CEX or DEX offers this unique feature.",
      points: [
        "Stocks as collateral for crypto",
        "Cross-asset trading opportunities",
        "Keep your existing positions",
        "Maximize capital efficiency",
      ],
    },
    {
      icon: TrendingUp,
      title: "Direct Web2 to Web3 Trading",
      subtitle: "Smart routing technology",
      description:
        "Trade your traditional assets directly against crypto without complex swapping. Our smart routing handles everything behind the scenes.",
      points: [
        "No swapping through intermediary assets",
        "Optimal execution algorithms",
        "Reduced trading fees",
        "Faster settlement times",
      ],
    },
  ];

  const stats = [
    {
      number: "10+",
      label: "Asset Classes",
      description: "Stocks, bonds, commodities & more",
    },
    {
      number: "50+",
      label: "Global Exchanges",
      description: "Worldwide market access",
    },
    {
      number: "24/7",
      label: "Platform Uptime",
      description: "Always-on trading capabilities",
    },
    {
      number: "0",
      label: "Data Selling",
      description: "Your privacy is guaranteed",
    },
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            The Problems We Solve
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Traditional trading platforms compromise your privacy, limit your
            collateral options, and restrict market access. We believe you
            deserve better.
          </p>
        </div>

        {/* Main reasons */}
        <div className="space-y-16 mb-20">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={reason.title}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">
                        {reason.title}
                      </h3>
                      <p className="text-emerald-400 font-medium">
                        {reason.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-lg text-gray-300 leading-relaxed">
                    {reason.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-3">
                    {reason.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center text-gray-400"
                      >
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3" />
                        {point}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual element */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
                      <div className="space-y-4">
                        <div className="h-4 bg-slate-700 rounded animate-pulse" />
                        <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse" />
                      </div>
                      <div className="mt-6 flex justify-between items-center">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="text-right">
                          <div className="h-3 bg-slate-700 rounded w-16 animate-pulse mb-2" />
                          <div className="h-2 bg-slate-700 rounded w-12 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl -z-10 blur-xl" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats section */}
        <div className="border-t border-slate-700 pt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Platform by the Numbers
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
