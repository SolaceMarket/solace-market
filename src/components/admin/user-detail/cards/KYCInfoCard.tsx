"use client";

import { useState } from "react";
import type { AdminUserDetailProps } from "../types";
import { 
  formatDate, 
  getStatusColor, 
  getRiskLevelColor,
  getKYCLevelColor,
  formatConfidenceScore,
  getProviderDisplayName 
} from "../utils";

interface KYCCheckBadgeProps {
  label: string;
  status?: string;
  score?: number;
  details?: string;
}

function KYCCheckBadge({ label, status, score, details }: KYCCheckBadgeProps) {
  if (!status) return null;
  
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
      <div className="flex items-center space-x-2">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      <div className="text-xs text-gray-500">
        {score !== undefined && `${score}%`}
        {details && (
          <div className="mt-1 text-xs text-gray-400 max-w-32 truncate" title={details}>
            {details}
          </div>
        )}
      </div>
    </div>
  );
}

interface AMLMatchesProps {
  matches?: Array<{
    type: "sanctions" | "pep" | "adverse_media";
    name: string;
    country: string;
    confidence: number;
    details: string;
  }>;
}

function AMLMatches({ matches }: AMLMatchesProps) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="mt-2 space-y-1">
      {matches.map((match, index) => (
        <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-medium text-red-800">{match.type.toUpperCase()}</span>
              <div className="text-red-700">{match.name} ({match.country})</div>
              <div className="text-red-600 mt-1">{match.details}</div>
            </div>
            <span className="text-red-800 font-medium">{match.confidence}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ComplianceNotesProps {
  notes?: Array<{
    timestamp: string;
    author: string;
    note: string;
    type: "info" | "warning" | "critical";
  }>;
}

function ComplianceNotes({ notes }: ComplianceNotesProps) {
  const [showNotes, setShowNotes] = useState(false);
  
  if (!notes || notes.length === 0) return null;

  const noteTypeColors = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800", 
    critical: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowNotes(!showNotes)}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        {showNotes ? "Hide" : "Show"} Compliance Notes ({notes.length})
      </button>
      {showNotes && (
        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
          {notes.map((note, index) => (
            <div key={index} className={`p-2 border rounded text-xs ${noteTypeColors[note.type]}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium">{note.type.toUpperCase()}</span>
                <span className="text-gray-500">{formatDate(note.timestamp)}</span>
              </div>
              <div className="mb-1">{note.note}</div>
              <div className="text-gray-600">By: {note.author}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KYCInfoCard({
  user,
  onEdit,
  onUpdate,
}: Pick<AdminUserDetailProps, "user" | "onEdit"> & {
  onUpdate?: (action: string, data: Record<string, unknown>) => Promise<void>;
}) {
  if (!user.kyc) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">KYC Information</h2>
          <button
            type="button"
            onClick={() => onEdit("kyc")}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📋</div>
          <div>No KYC information available</div>
        </div>
      </div>
    );
  }

  const { kyc } = user;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">KYC Information</h2>
        <div className="flex space-x-2">
          {/* Quick Action Buttons */}
          {user.kyc && onUpdate && (
            <>
              {user.kyc.status === "under_review" && (
                <>
                  <button
                    type="button"
                    onClick={() => onUpdate("updateKyc", { status: "approved" })}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdate("updateKyc", { status: "rejected" })}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Reject
                  </button>
                </>
              )}
              {user.kyc.status === "requires_more" && (
                <button
                  type="button"
                  onClick={() => onUpdate("updateKyc", { status: "under_review" })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                >
                  Review
                </button>
              )}
            </>
          )}
          <button
            type="button"
            onClick={() => onEdit("kyc")}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Primary Status & Level */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(kyc.status)}`}>
                {kyc.status.replace("_", " ").toUpperCase()}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Level</dt>
            <dd>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKYCLevelColor(kyc.level)}`}>
                {kyc.level.toUpperCase()}
              </span>
            </dd>
          </div>
        </div>

        {/* Provider & Risk */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Provider</dt>
            <dd className="text-sm text-gray-900">{getProviderDisplayName(kyc.provider)}</dd>
            {kyc.externalId && (
              <dd className="text-xs text-gray-500">ID: {kyc.externalId}</dd>
            )}
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Risk Level</dt>
            <dd>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(kyc.riskLevel)}`}>
                {kyc.riskLevel.toUpperCase()}
              </span>
            </dd>
          </div>
        </div>

        {/* Verification Checks */}
        {kyc.checks && Object.keys(kyc.checks).length > 0 && (
          <div>
            <dt className="text-sm font-medium text-gray-500 mb-2">Verification Checks</dt>
            <div className="space-y-1">
              <KYCCheckBadge 
                label="Identity" 
                status={kyc.checks.identity?.status}
                score={kyc.checks.identity?.score}
                details={kyc.checks.identity?.details}
              />
              <KYCCheckBadge 
                label="Address" 
                status={kyc.checks.address?.status}
                score={kyc.checks.address?.score}
                details={kyc.checks.address?.details}
              />
              <KYCCheckBadge 
                label="Biometric" 
                status={kyc.checks.biometric?.status}
                score={kyc.checks.biometric?.score}
                details={kyc.checks.biometric?.details}
              />
              <KYCCheckBadge 
                label="Liveness" 
                status={kyc.checks.liveness?.status}
                score={kyc.checks.liveness?.score}
                details={kyc.checks.liveness?.details}
              />
              <KYCCheckBadge 
                label="Sanctions" 
                status={kyc.checks.sanctions?.status}
                score={kyc.checks.sanctions?.score}
                details={kyc.checks.sanctions?.details}
              />
              <KYCCheckBadge 
                label="PEP Check" 
                status={kyc.checks.pep?.status}
                score={kyc.checks.pep?.score}
                details={kyc.checks.pep?.details}
              />
            </div>
          </div>
        )}

        {/* AML Screening */}
        {kyc.amlScreening && (
          <div>
            <dt className="text-sm font-medium text-gray-500">AML Screening</dt>
            <dd className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(kyc.amlScreening.status)}`}>
                {kyc.amlScreening.status.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">
                {getProviderDisplayName(kyc.amlScreening.provider)} • {formatDate(kyc.amlScreening.checkedAt)}
              </span>
            </dd>
            <AMLMatches matches={kyc.amlScreening.matches} />
          </div>
        )}

        {/* Important Dates */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Last Checked:</span>
            <span className="text-gray-900">{formatDate(kyc.lastCheckedAt)}</span>
          </div>
          {kyc.submittedAt && (
            <div className="flex justify-between">
              <span className="text-gray-500">Submitted:</span>
              <span className="text-gray-900">{formatDate(kyc.submittedAt)}</span>
            </div>
          )}
          {kyc.approvedAt && (
            <div className="flex justify-between">
              <span className="text-gray-500">Approved:</span>
              <span className="text-gray-900">{formatDate(kyc.approvedAt)}</span>
            </div>
          )}
          {kyc.rejectedAt && (
            <div className="flex justify-between">
              <span className="text-gray-500">Rejected:</span>
              <span className="text-gray-900">{formatDate(kyc.rejectedAt)}</span>
            </div>
          )}
          {kyc.expiresAt && (
            <div className="flex justify-between">
              <span className="text-gray-500">Expires:</span>
              <span className="text-gray-900">{formatDate(kyc.expiresAt)}</span>
            </div>
          )}
          {kyc.nextReviewDue && (
            <div className="flex justify-between">
              <span className="text-gray-500">Next Review:</span>
              <span className="text-gray-900">{formatDate(kyc.nextReviewDue)}</span>
            </div>
          )}
        </div>

        {/* Rejection Reason */}
        {kyc.rejectionReason && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Rejection Reason</dt>
            <dd className="text-sm text-red-700 bg-red-50 p-2 rounded border border-red-200">
              {kyc.rejectionReason}
            </dd>
          </div>
        )}

        {/* Review Information */}
        {(kyc.reviewedBy || kyc.reviewedAt) && (
          <div className="border-t pt-4">
            <dt className="text-sm font-medium text-gray-500 mb-2">Review Information</dt>
            <div className="text-sm space-y-1">
              {kyc.reviewedBy && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Reviewed by:</span>
                  <span className="text-gray-900">{kyc.reviewedBy}</span>
                </div>
              )}
              {kyc.reviewedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Reviewed at:</span>
                  <span className="text-gray-900">{formatDate(kyc.reviewedAt)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Technical Information */}
        {(kyc.ipAddress || kyc.userAgent || kyc.deviceFingerprint) && (
          <div className="border-t pt-4">
            <dt className="text-sm font-medium text-gray-500 mb-2">Technical Information</dt>
            <div className="text-xs space-y-1 text-gray-600">
              {kyc.ipAddress && (
                <div className="flex justify-between">
                  <span>IP Address:</span>
                  <span className="font-mono">{kyc.ipAddress}</span>
                </div>
              )}
              {kyc.deviceFingerprint && (
                <div className="flex justify-between">
                  <span>Device ID:</span>
                  <span className="font-mono">{kyc.deviceFingerprint.substring(0, 12)}...</span>
                </div>
              )}
              {kyc.userAgent && (
                <div>
                  <span>User Agent:</span>
                  <div className="mt-1 p-1 bg-gray-100 rounded font-mono text-xs break-all">
                    {kyc.userAgent}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compliance Notes */}
        {kyc.complianceNotes && kyc.complianceNotes.length > 0 && (
          <div className="border-t pt-4">
            <ComplianceNotes notes={kyc.complianceNotes} />
          </div>
        )}
      </div>
    </div>
  );
}
