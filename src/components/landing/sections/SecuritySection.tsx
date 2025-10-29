"use client";

import { CheckCircle, Database, Eye, Lock, Shield } from "lucide-react";

export function SecuritySection() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Bank-Grade Encryption",
      description:
        "All data is encrypted using AES-256 encryption, the same standard used by major financial institutions.",
    },
    {
      icon: Lock,
      title: "Multi-Factor Authentication",
      description:
        "Secure your account with multiple verification layers including biometric and hardware key support.",
    },
    {
      icon: Eye,
      title: "Privacy by Design",
      description:
        "Built from the ground up with privacy principles. Your trading data is never shared or sold to third parties.",
    },
    {
      icon: Database,
      title: "Decentralized Storage",
      description:
        "Critical data is distributed across secure nodes, eliminating single points of failure.",
    },
  ];

  const privacyPromises = [
    "No tracking of your trading patterns for advertising",
    "No sale of personal data to data brokers",
    "No sharing of information with social media platforms",
    "Complete control over your data and privacy settings",
    "Right to data deletion and portability",
    "Transparent privacy policy with no hidden clauses",
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Your Privacy & Security Matter
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            In an age where personal data is constantly harvested and sold, we
            believe your financial privacy should be sacred and protected.
          </p>
        </div>

        {/* Security features grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {securityFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Privacy promises */}
        <div className="bg-slate-900/30 border border-emerald-500/20 rounded-2xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Our Privacy Promise
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Unlike traditional brokers who profit from your data, we believe
                privacy is a fundamental right. Here's our commitment to you:
              </p>

              <div className="space-y-4">
                {privacyPromises.map((promise) => (
                  <div key={promise} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{promise}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Privacy visualization */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-4">
                  Your Data Stays Yours
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We use advanced encryption and privacy-preserving technologies
                  to ensure your trading activity remains completely
                  confidential.
                </p>

                {/* Animated privacy indicators */}
                <div className="mt-8 flex justify-center space-x-4">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse animation-delay-1000" />
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse animation-delay-2000" />
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl -z-10 blur-xl" />
            </div>
          </div>
        </div>

        {/* Bottom disclaimer */}
        <div className="text-center mt-16">
          <p className="text-sm text-gray-500 max-w-3xl mx-auto">
            Security Notice: While we implement industry-leading security
            measures, please remember that all trading involves risk. Never
            invest more than you can afford to lose, and always enable
            additional security features like 2FA to protect your account.
          </p>
        </div>
      </div>
    </section>
  );
}
