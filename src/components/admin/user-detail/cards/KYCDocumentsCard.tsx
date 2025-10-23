"use client";

import { useState } from "react";
import type { AdminUserDetailProps } from "../types";
import type { KYCDocument } from "@/types/user";
import { formatDate, getStatusColor } from "../utils";

interface DocumentCardProps {
  document: KYCDocument;
  onView: (document: KYCDocument) => void;
}

function DocumentCard({ document, onView }: DocumentCardProps) {
  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  const getDocumentIcon = (type: string) => {
    const icons: Record<string, string> = {
      identity: "🪪",
      passport: "📘",
      drivers_license: "🚗", 
      national_id: "🆔",
      address: "🏠",
      utility_bill: "⚡",
      bank_statement: "🏦",
      selfie: "🤳",
      proof_of_income: "💰",
    };
    return icons[type] || "📄";
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getDocumentIcon(document.type)}</span>
          <div>
            <h4 className="text-sm font-medium text-gray-900 capitalize">
              {document.type.replace("_", " ")}
            </h4>
            <p className="text-xs text-gray-500">{document.fileName}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
          {document.status}
        </span>
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Size:</span>
          <span>{formatFileSize(document.fileSize)}</span>
        </div>
        <div className="flex justify-between">
          <span>Uploaded:</span>
          <span>{formatDate(document.uploadedAt)}</span>
        </div>
        {document.expiresAt && (
          <div className="flex justify-between">
            <span>Expires:</span>
            <span>{formatDate(document.expiresAt)}</span>
          </div>
        )}
        {document.reviewedAt && (
          <div className="flex justify-between">
            <span>Reviewed:</span>
            <span>{formatDate(document.reviewedAt)}</span>
          </div>
        )}
      </div>

      {/* Document Analysis */}
      {document.analysis && (
        <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-blue-800">Analysis</span>
            <span className="text-xs text-blue-600">{document.analysis.confidence}% confidence</span>
          </div>
          {document.analysis.issueCountry && (
            <div className="text-xs text-blue-700">Country: {document.analysis.issueCountry}</div>
          )}
          {document.analysis.documentNumber && (
            <div className="text-xs text-blue-700">Number: {document.analysis.documentNumber}</div>
          )}
          {document.analysis.issuedDate && document.analysis.expiryDate && (
            <div className="text-xs text-blue-700">
              Valid: {formatDate(document.analysis.issuedDate)} - {formatDate(document.analysis.expiryDate)}
            </div>
          )}
        </div>
      )}

      {/* Fraud Detection */}
      {document.fraudChecks && (
        <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-yellow-800">Fraud Detection</span>
            <span className="text-xs text-yellow-600">{document.fraudChecks.confidence}% confidence</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className={`${document.fraudChecks.tampered ? "text-red-600" : "text-green-600"}`}>
              Tampered: {document.fraudChecks.tampered ? "Yes" : "No"}
            </div>
            <div className={`${document.fraudChecks.photoSubstitution ? "text-red-600" : "text-green-600"}`}>
              Photo Sub: {document.fraudChecks.photoSubstitution ? "Yes" : "No"}
            </div>
            <div className={`${!document.fraudChecks.validFormat ? "text-red-600" : "text-green-600"}`}>
              Valid Format: {document.fraudChecks.validFormat ? "Yes" : "No"}
            </div>
            <div className={`${document.fraudChecks.digitalDocument ? "text-orange-600" : "text-green-600"}`}>
              Digital: {document.fraudChecks.digitalDocument ? "Yes" : "No"}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason */}
      {document.rejectionReason && (
        <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
          <span className="text-xs font-medium text-red-800">Rejection Reason:</span>
          <p className="text-xs text-red-700 mt-1">{document.rejectionReason}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => onView(document)}
        className="mt-3 w-full text-center py-2 px-3 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        View Document
      </button>
    </div>
  );
}

export default function KYCDocumentsCard({
  user,
}: Pick<AdminUserDetailProps, "user">) {
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null);

  if (!user.kyc?.documents || user.kyc.documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">KYC Documents</h2>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📄</div>
          <div>No documents uploaded</div>
        </div>
      </div>
    );
  }

  const handleViewDocument = (document: KYCDocument) => {
    setSelectedDocument(document);
    // Here you would typically open a modal or new tab to view the document
    // For now, we'll just log it
    console.log("Viewing document:", document);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          KYC Documents ({user.kyc.documents.length})
        </h2>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.kyc.status)}`}>
          {user.kyc.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user.kyc.documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onView={handleViewDocument}
          />
        ))}
      </div>

      {user.kyc.submittedAt && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Documents submitted: {formatDate(user.kyc.submittedAt)}
          </div>
        </div>
      )}
    </div>
  );
}