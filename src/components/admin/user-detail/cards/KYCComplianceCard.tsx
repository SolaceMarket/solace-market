"use client";

import { useState } from "react";
import type { AdminUserDetailProps } from "../types";
import { formatDate, getStatusColor, getRiskLevelColor } from "../utils";

interface ComplianceAlertProps {
  type: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
  source?: string;
}

function ComplianceAlert({ type, message, timestamp, source }: ComplianceAlertProps) {
  const alertColors = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    critical: "bg-red-50 border-red-200 text-red-800",
  };

  const alertIcons = {
    info: "ℹ️",
    warning: "⚠️", 
    critical: "🚨",
  };

  return (
    <div className={`border rounded-lg p-3 ${alertColors[type]}`}>
      <div className="flex items-start space-x-2">
        <span className="text-lg">{alertIcons[type]}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs opacity-75">{formatDate(timestamp)}</span>
            {source && <span className="text-xs opacity-75">Source: {source}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AuditEventProps {
  event: {
    timestamp: string;
    action: string;
    actor: string;
    details?: string;
    metadata?: Record<string, unknown>;
  };
}

function AuditEvent({ event }: AuditEventProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border-l-2 border-gray-200 pl-4 pb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-900">{event.action}</p>
          <p className="text-xs text-gray-500">by {event.actor}</p>
        </div>
        <span className="text-xs text-gray-400">{formatDate(event.timestamp)}</span>
      </div>
      
      {event.details && (
        <p className="text-xs text-gray-600 mt-1">{event.details}</p>
      )}
      
      {event.metadata && Object.keys(event.metadata).length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showDetails ? "Hide" : "Show"} Details
          </button>
          {showDetails && (
            <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(event.metadata, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default function KYCComplianceCard({
  user,
}: Pick<AdminUserDetailProps, "user">) {
  const [activeTab, setActiveTab] = useState<"overview" | "alerts" | "audit">("overview");

  if (!user.kyc) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">KYC Compliance</h2>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <div>No KYC data available</div>
        </div>
      </div>
    );
  }

  // Mock compliance data - in a real app this would come from your compliance system
  const complianceAlerts: ComplianceAlertProps[] = [
    {
      type: "warning",
      message: "KYC verification expires in 30 days",
      timestamp: "2024-10-15T10:00:00Z",
      source: "Compliance Engine"
    },
    {
      type: "info", 
      message: "Periodic review completed successfully",
      timestamp: "2024-10-10T15:30:00Z",
      source: "Manual Review"
    }
  ];

  const auditEvents = [
    {
      timestamp: "2024-10-15T14:30:00Z",
      action: "KYC Status Updated",
      actor: "admin@company.com",
      details: `Status changed from 'under_review' to 'approved'`,
      metadata: { previousStatus: "under_review", newStatus: "approved" }
    },
    {
      timestamp: "2024-10-14T09:15:00Z", 
      action: "Document Reviewed",
      actor: "reviewer@company.com",
      details: "Passport document approved",
      metadata: { documentId: "doc_123", documentType: "passport" }
    },
    {
      timestamp: "2024-10-13T16:45:00Z",
      action: "AML Screening Completed",
      actor: "system",
      details: "No matches found in sanctions database",
      metadata: { provider: "Dow Jones", matches: 0 }
    }
  ];

  const getRiskScore = () => {
    // Mock risk scoring based on various factors
    if (!user.kyc) return 0;
    
    const factors = {
      geoRisk: user.profile?.country === "US" ? 10 : 30,
      kycStatus: user.kyc.status === "approved" ? 10 : 50,
      documentQuality: 15,
      behaviorRisk: 20
    };
    
    return Object.values(factors).reduce((sum, score) => sum + score, 0) / 4;
  };

  const riskScore = getRiskScore();
  const riskLevel = riskScore < 20 ? "low" : riskScore < 40 ? "medium" : riskScore < 70 ? "high" : "critical";

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 pt-4">
          {[
            { id: "overview", label: "Overview" },
            { id: "alerts", label: `Alerts (${complianceAlerts.length})` },
            { id: "audit", label: `Audit Trail (${auditEvents.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Overview</h3>
              
              {/* Risk Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Overall Risk Score</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          riskLevel === "low" ? "bg-green-500" :
                          riskLevel === "medium" ? "bg-yellow-500" :
                          riskLevel === "high" ? "bg-orange-500" : "bg-red-500"
                        }`}
                        style={{ width: `${riskScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{Math.round(riskScore)}</span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getRiskLevelColor(riskLevel)}`}>
                    {riskLevel.toUpperCase()} RISK
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Compliance Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.kyc.status)}`}>
                    {user.kyc.status.replace("_", " ").toUpperCase()}
                  </span>
                  {user.kyc.expiresAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Expires: {formatDate(user.kyc.expiresAt)}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Last Review</h4>
                  <p className="text-sm text-gray-900">{formatDate(user.kyc.lastCheckedAt)}</p>
                  {user.kyc.nextReviewDue && (
                    <p className="text-xs text-gray-500 mt-1">
                      Next: {formatDate(user.kyc.nextReviewDue)}
                    </p>
                  )}
                </div>
              </div>

              {/* Regulatory Information */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Regulatory Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Jurisdiction:</span>
                    <span className="ml-2 text-blue-900">{user.jurisdiction}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Tax Residency:</span>
                    <span className="ml-2 text-blue-900">{user.profile?.taxResidency || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Country:</span>
                    <span className="ml-2 text-blue-900">{user.profile?.country || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Provider:</span>
                    <span className="ml-2 text-blue-900">{user.kyc.provider}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Alerts</h3>
            {complianceAlerts.length > 0 ? (
              <div className="space-y-3">
                {complianceAlerts.map((alert, index) => (
                  <ComplianceAlert key={index} {...alert} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">✅</div>
                <div>No active compliance alerts</div>
              </div>
            )}
          </div>
        )}

        {activeTab === "audit" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
            {auditEvents.length > 0 ? (
              <div className="space-y-4">
                {auditEvents.map((event, index) => (
                  <AuditEvent key={index} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📋</div>
                <div>No audit events recorded</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}