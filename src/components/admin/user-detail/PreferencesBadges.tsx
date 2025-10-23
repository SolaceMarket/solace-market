"use client";

import type { UserPreferences } from "@/types";

interface PreferencesBadgesProps {
  preferences: UserPreferences;
  className?: string;
}

export function PreferencesThemeBadge({ 
  theme, 
  className 
}: { 
  theme: UserPreferences["theme"]; 
  className?: string;
}) {
  const getBadgeColor = (theme: UserPreferences["theme"]) => {
    switch (theme) {
      case "dark":
        return "bg-gray-800 text-white";
      case "light":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(theme)} ${className || ""}`}
    >
      {theme === "dark" ? "🌙" : "☀️"} {theme.charAt(0).toUpperCase() + theme.slice(1)}
    </span>
  );
}

export function PreferencesQuoteBadge({ 
  quote, 
  className 
}: { 
  quote: UserPreferences["defaultQuote"]; 
  className?: string;
}) {
  const getBadgeColor = (quote: UserPreferences["defaultQuote"]) => {
    switch (quote) {
      case "USD":
        return "bg-green-100 text-green-800";
      case "EUR":
        return "bg-blue-100 text-blue-800";
      case "USDC":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(quote)} ${className || ""}`}
    >
      💰 {quote}
    </span>
  );
}

export function PreferencesNotificationSummary({ 
  preferences, 
  className 
}: PreferencesBadgesProps) {
  const enabledCount = [
    preferences.news,
    preferences.orderFills,
    preferences.riskAlerts,
    preferences.statements,
  ].filter(Boolean).length;

  const total = 4;
  const getColor = () => {
    if (enabledCount === total) return "bg-green-100 text-green-800";
    if (enabledCount >= total / 2) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getColor()} ${className || ""}`}
    >
      🔔 {enabledCount}/{total} Enabled
    </span>
  );
}

export function PreferencesHintsBadge({ 
  hintsEnabled, 
  className 
}: { 
  hintsEnabled: boolean; 
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        hintsEnabled 
          ? "bg-blue-100 text-blue-800" 
          : "bg-gray-100 text-gray-800"
      } ${className || ""}`}
    >
      {hintsEnabled ? "💡 Hints On" : "🚫 Hints Off"}
    </span>
  );
}

export function PreferencesQuickSummary({ 
  preferences, 
  className 
}: PreferencesBadgesProps) {
  return (
    <div className={`flex flex-wrap gap-1 ${className || ""}`}>
      <PreferencesThemeBadge theme={preferences.theme} />
      <PreferencesQuoteBadge quote={preferences.defaultQuote} />
      <PreferencesNotificationSummary preferences={preferences} />
      <PreferencesHintsBadge hintsEnabled={preferences.hintsEnabled} />
    </div>
  );
}