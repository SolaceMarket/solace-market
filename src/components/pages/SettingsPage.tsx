"use client";

import { Bell, LogOut, Moon, Shield, User, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlowEffect, IlluminationBackground } from "@/components/ui";
import { useSolana } from "@/components/web3/solana/SolanaProvider";

export function SettingsPage() {
  const router = useRouter();
  const { isConnected, selectedWallet, selectedAccount, setWalletAndAccount } =
    useSolana();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    try {
      // Clear the wallet state in the context
      setWalletAndAccount(null, null);
      router.push("/web3-onboarding");
    } catch (err) {
      console.error("Failed to disconnect wallet:", err);
      // Still redirect even if disconnect fails
      router.push("/web3-onboarding");
    }
  };

  return (
    <AppLayout title="Settings" showBackButton={true} backUrl="/assets-list">
      <div className="relative w-full">
        {/* Background Effects */}
        <IlluminationBackground glowTheme="emerald" />

        <div className="relative z-10 w-full max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Wallet Information Card */}
          {isConnected && selectedWallet && selectedAccount && (
            <GlowEffect variant="modal" glowColor="emerald" intensity="subtle">
              <div className="bg-slate-800/90 backdrop-blur rounded-xl p-6 border border-emerald-500/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      Connected Wallet
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {selectedWallet?.name}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Address:</span>
                    <span className="text-white text-sm font-mono">
                      {selectedAccount?.address ? (
                        <>
                          {selectedAccount.address.slice(0, 6)}...
                          {selectedAccount.address.slice(-4)}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span className="text-emerald-400 text-sm flex items-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2" />
                      Connected
                    </span>
                  </div>
                </div>
              </div>
            </GlowEffect>
          )}

          {/* Settings Options */}
          <div className="space-y-4">
            {/* Account Settings */}
            <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-400" />
                Account
              </h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
                >
                  <span className="text-gray-300">Profile</span>
                  <span className="text-gray-500">→</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/security")}
                  className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
                >
                  <span className="text-gray-300">Security</span>
                  <span className="text-gray-500">→</span>
                </button>
              </div>
            </div>

            {/* App Settings */}
            <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-400" />
                Preferences
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center">
                    <Moon className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-300">Dark Mode</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      darkMode ? "bg-emerald-500" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        darkMode ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center">
                    <Bell className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-300">Notifications</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(!notifications)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications ? "bg-emerald-500" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        notifications ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            {isConnected && (
              <div className="bg-red-900/20 backdrop-blur rounded-xl p-4 border border-red-500/30">
                <h3 className="text-red-400 font-semibold mb-3">Danger Zone</h3>
                <GlowEffect
                  variant="button"
                  glowColor="white"
                  intensity="subtle"
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Disconnect Wallet</span>
                  </button>
                </GlowEffect>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
