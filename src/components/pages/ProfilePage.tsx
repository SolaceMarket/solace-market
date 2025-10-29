"use client";

import {
  Calendar,
  Camera,
  Mail,
  MapPin,
  Shield,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlowEffect, IlluminationBackground } from "@/components/ui";
import { useSolana } from "@/components/web3/solana/SolanaProvider";
import { getCurrentProfile, type UserProfile } from "@/data/profileData";

export function ProfilePage() {
  const router = useRouter();
  const { isConnected, selectedAccount } = useSolana();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(getCurrentProfile());

  const handleSaveProfile = () => {
    // Here you would typically save to an API
    setIsEditing(false);
    setProfile({ ...profile, hasCompletedProfile: true });
    // Show success notification
  };

  const handleStartKYC = () => {
    // Navigate to KYC flow
    router.push("/kyc");
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "text-emerald-400";
      case "Pending":
        return "text-yellow-400";
      default:
        return "text-red-400";
    }
  };

  return (
    <AppLayout
      title="Profile"
      showBackButton={true}
      backUrl="/settings"
      rightAction={{
        label: isEditing ? "Cancel" : "Edit",
        onClick: () => setIsEditing(!isEditing),
        variant: "primary",
      }}
    >
      <div className="relative w-full">
        {/* Background Effects */}
        <IlluminationBackground glowTheme="blue" />

        <div className="relative z-10 w-full max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Profile Header */}
          <GlowEffect variant="modal" glowColor="blue" intensity="subtle">
            <div className="bg-slate-800/90 backdrop-blur rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Camera className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      placeholder="Enter your name"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-white">
                      {profile.name || "Anonymous Trader"}
                    </h2>
                  )}
                  <p className="text-gray-400 text-sm flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {isConnected
                      ? `Connected since ${profile.joinDate}`
                      : "Wallet not connected"}
                  </p>
                </div>
              </div>

              {/* KYC Status */}
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-300">Identity Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${getKycStatusColor(profile.kycStatus)}`}
                  >
                    {profile.kycStatus}
                  </span>
                  {profile.kycStatus === "Not Started" && (
                    <button
                      type="button"
                      onClick={handleStartKYC}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
                    >
                      Start KYC
                    </button>
                  )}
                </div>
              </div>
            </div>
          </GlowEffect>

          {/* Contact Information */}
          <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-400" />
              Contact Information
              {!profile.hasCompletedProfile && (
                <span className="ml-2 text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded-full">
                  Optional
                </span>
              )}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Email</span>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    className="bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <span className="text-white text-sm">
                    {profile.email || "Not provided"}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Phone</span>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                    className="bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <span className="text-white text-sm">
                    {profile.phone || "Not provided"}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Location</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                    placeholder="City, Country"
                    className="bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <span className="text-white text-sm flex items-center">
                    {profile.location ? (
                      <>
                        <MapPin className="w-3 h-3 mr-1" />
                        {profile.location}
                      </>
                    ) : (
                      "Not provided"
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Trading Profile */}
          <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
              Trading Profile
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Total Invested</p>
                  <p className="text-white font-semibold">
                    {profile.totalInvested}
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Portfolio Value</p>
                  <p className="text-white font-semibold">
                    {profile.portfolioValue}
                  </p>
                </div>
              </div>
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Total Gains</p>
                <p className="text-emerald-400 font-semibold">
                  {profile.totalGains}
                </p>
              </div>
            </div>
          </div>

          {/* Investment Preferences */}
          <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-3">
              Investment Preferences
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Risk Tolerance</span>
                {isEditing ? (
                  <select
                    value={profile.riskTolerance}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        riskTolerance: e.target
                          .value as UserProfile["riskTolerance"],
                      })
                    }
                    className="bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Not Set">Not Set</option>
                    <option value="Conservative">Conservative</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                ) : (
                  <span
                    className={`text-sm ${profile.riskTolerance === "Not Set" ? "text-gray-400" : "text-white"}`}
                  >
                    {profile.riskTolerance}
                  </span>
                )}
              </div>
              <div>
                <span className="text-gray-400 text-sm block mb-2">
                  Preferred Assets
                </span>
                {profile.preferredAssets.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredAssets.map((asset: string) => (
                      <span
                        key={asset}
                        className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs"
                      >
                        {asset}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">
                    {isEditing
                      ? "Add your preferred asset types"
                      : "None selected"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Connected Wallet */}
          {isConnected && selectedAccount && (
            <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Wallet className="w-5 h-5 mr-2 text-emerald-400" />
                Connected Wallet
              </h3>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Public Key</p>
                <p className="text-white text-sm font-mono break-all">
                  {selectedAccount.publicKey.toString()}
                </p>
              </div>
            </div>
          )}

          {/* Profile Completion Prompt */}
          {!profile.hasCompletedProfile && !isEditing && (
            <GlowEffect variant="modal" glowColor="emerald" intensity="subtle">
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 backdrop-blur rounded-xl p-4 border border-yellow-500/30">
                <h3 className="text-yellow-400 font-semibold mb-2 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Complete Your Profile
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Trading anonymously? That's fine! You can add personal
                  information later for enhanced features and security.
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                >
                  Add Personal Information
                </button>
              </div>
            </GlowEffect>
          )}

          {/* Save Button */}
          {isEditing && (
            <GlowEffect variant="button" glowColor="blue" intensity="subtle">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Save Changes
              </button>
            </GlowEffect>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
