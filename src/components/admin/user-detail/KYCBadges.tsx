"use client";

import { getStatusColor, getRiskLevelColor, getKYCLevelColor } from "./utils";
import type { KYCStatus, KYCLevel, KYCRiskLevel } from "@/types/base";

interface KYCStatusBadgeProps {
  status: KYCStatus;
  className?: string;
}

export function KYCStatusBadge({ status, className = "" }: KYCStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)} ${className}`}>
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
}

interface KYCLevelBadgeProps {
  level: KYCLevel;
  className?: string;
}

export function KYCLevelBadge({ level, className = "" }: KYCLevelBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKYCLevelColor(level)} ${className}`}>
      {level.toUpperCase()}
    </span>
  );
}

interface KYCRiskBadgeProps {
  riskLevel: KYCRiskLevel;
  className?: string;
}

export function KYCRiskBadge({ riskLevel, className = "" }: KYCRiskBadgeProps) {
  const riskIcons = {
    low: "🟢",
    medium: "🟡", 
    high: "🟠",
    critical: "🔴",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(riskLevel)} ${className}`}>
      <span className="mr-1">{riskIcons[riskLevel]}</span>
      {riskLevel.toUpperCase()} RISK
    </span>
  );
}

interface KYCComplianceScoreProps {
  score: number;
  className?: string;
}

export function KYCComplianceScore({ score, className = "" }: KYCComplianceScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    if (score >= 50) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${getScoreColor(score)} ${className}`}>
      <span className="text-lg mr-1">📊</span>
      {Math.round(score)}% Compliance
    </div>
  );
}

interface KYCQuickSummaryProps {
  status: KYCStatus;
  level?: KYCLevel;
  riskLevel?: KYCRiskLevel;
  provider?: string;
  className?: string;
}

export function KYCQuickSummary({ 
  status, 
  level, 
  riskLevel, 
  provider,
  className = "" 
}: KYCQuickSummaryProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <KYCStatusBadge status={status} />
      {level && <KYCLevelBadge level={level} />}
      {riskLevel && <KYCRiskBadge riskLevel={riskLevel} />}
      {provider && (
        <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
          {provider}
        </span>
      )}
    </div>
  );
}