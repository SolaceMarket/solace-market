"use client";

import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { SolaceLogo } from "@/components/ui/shared/SolaceLogo";

export function FooterSection() {
  const footerLinks = {
    platform: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Security", href: "/security" },
      { name: "API Docs", href: "/docs" },
    ],
    trading: [
      { name: "Asset Classes", href: "/assets" },
      { name: "Exchanges", href: "/exchanges" },
      { name: "Portfolio", href: "/portfolio" },
      { name: "Analytics", href: "/analytics" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "System Status", href: "/status" },
      { name: "Community", href: "/community" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Risk Disclosure", href: "/risk" },
      { name: "Compliance", href: "/compliance" },
    ],
  };

  const socialLinks = [
    {
      icon: Twitter,
      href: "https://twitter.com/solacemarket",
      label: "Twitter",
    },
    { icon: Github, href: "https://github.com/solacemarket", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/solacemarket",
      label: "LinkedIn",
    },
    { icon: Mail, href: "mailto:support@solacemarket.com", label: "Email" },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <SolaceLogo size={32} className="flex-shrink-0" />
                <h3 className="text-2xl font-bold text-white">Solace Market</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The future of private, flexible, and comprehensive trading.
                Trade any asset, keep your privacy, use flexible collateral.
              </p>
            </div>

            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trading links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Trading</h4>
            <ul className="space-y-3">
              {footerLinks.trading.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © 2025 Solace Market. All rights reserved.
            </div>

            <div className="text-sm text-gray-500 text-center md:text-right">
              <p className="mb-1">
                Trading involves risk. Past performance does not guarantee
                future results.
              </p>
              <p>
                This platform does not provide financial advice. Trade
                responsibly.
              </p>
            </div>
          </div>
        </div>

        {/* Additional risk disclaimer */}
        <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Risk Warning:</strong> CFDs, Forex, and other leveraged
            products involve significant risk of loss and may not be suitable
            for all investors. You should consider whether you understand how
            these products work and whether you can afford to take the high risk
            of losing your money. Cryptocurrency investments are volatile and
            unregulated. No consumer protection exists. Capital is at risk.
          </p>
        </div>
      </div>
    </footer>
  );
}
