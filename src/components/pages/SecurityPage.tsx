"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  EmailVerification,
  PasswordManagement,
  SecurityPreferences,
  SecurityScore,
  TwoFactorAuth,
  WalletSecurity,
} from "@/components/security";
import { IlluminationBackground } from "@/components/ui";
import { useSolana } from "@/components/web3/solana/SolanaProvider";
import type { SecuritySettings } from "@/data/securityData";
import { defaultSecuritySettings, getSecurityScore } from "@/data/securityData";

export function SecurityPage() {
  const router = useRouter();
  const { isConnected, selectedAccount } = useSolana();
  const [settings, setSettings] = useState<SecuritySettings>(
    defaultSecuritySettings,
  );

  const securityScore = getSecurityScore(settings, isConnected);

  return (
    <AppLayout
      title="Security"
      showBackButton={true}
      backUrl="/settings"
      customHeader={
        <div className="h-full flex items-center justify-between p-4 bg-slate-900/90 backdrop-blur border-b border-slate-700/50">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold text-white">Security</h1>
          <div />
        </div>
      }
    >
      <div className="relative w-full">
        {/* Background Effects */}
        <IlluminationBackground glowTheme="emerald" />

        <div className="relative z-10 w-full max-w-md mx-auto px-4 py-6 space-y-6">
          <SecurityScore score={securityScore} />

          <EmailVerification
            settings={settings}
            onSettingsChange={setSettings}
          />

          <TwoFactorAuth settings={settings} onSettingsChange={setSettings} />

          <PasswordManagement
            settings={settings}
            onSettingsChange={setSettings}
          />

          <SecurityPreferences
            settings={settings}
            onSettingsChange={setSettings}
          />

          <WalletSecurity
            isConnected={isConnected}
            publicKey={selectedAccount?.publicKey}
          />
        </div>
      </div>
    </AppLayout>
  );
}
