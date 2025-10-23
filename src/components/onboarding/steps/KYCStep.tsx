"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "@/lib/i18n";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import type {
  Locale,
  KYCDocument,
  KYCData,
  DocumentType,
} from "@/types/onboarding";

interface KYCStepProps {
  locale: Locale;
  onNext: () => void;
  onPrevious: () => void;
}

export function KYCStep({ locale, onNext, onPrevious }: KYCStepProps) {
  const t = useTranslations(locale);
  const { user, saveKYC } = useOnboardingState();

  const [kycData, setKycData] = useState<KYCData>({
    documents: [],
    verificationStatus: "pending",
    submittedAt: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );

  const idUploadRef = useRef<HTMLInputElement>(null);
  const addressUploadRef = useRef<HTMLInputElement>(null);

  // Load existing KYC data if available
  useEffect(() => {
    if (user?.kyc) {
      // Convert UserKYC to KYCData format
      setKycData({
        documents: [], // UserKYC doesn't have documents array
        verificationStatus:
          user.kyc.status === "pending" ? "pending" : "under_review",
        submittedAt: user.kyc.submittedAt || null,
      });
    }
  }, [user]);

  const handleFileUpload = async (file: File, type: DocumentType) => {
    console.log(`KYCStep: Uploading ${type} document:`, file.name);

    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, WebP) or PDF file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError(null);
    const uploadId = `${type}-${Date.now()}`;
    setUploadProgress((prev) => ({ ...prev, [uploadId]: 0 }));

    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("userId", user?.uid || "");

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const current = prev[uploadId] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [uploadId]: current + 10 };
        });
      }, 200);

      // Upload file to API
      const response = await fetch("/api/onboarding/kyc/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      // Update progress to 100%
      setUploadProgress((prev) => ({ ...prev, [uploadId]: 100 }));

      // Create document object
      const newDocument: KYCDocument = {
        id: result.documentId || `${type}-${Date.now()}`,
        type,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: result.fileUrl || URL.createObjectURL(file), // Fallback for demo
        uploadedAt: new Date().toISOString(),
        status: "uploaded",
      };

      // Update KYC data
      setKycData((prev: KYCData) => ({
        ...prev,
        documents: [
          ...prev.documents.filter((doc: KYCDocument) => doc.type !== type), // Remove existing doc of same type
          newDocument,
        ],
      }));

      // Remove progress after delay
      setTimeout(() => {
        setUploadProgress((prev) => {
          const updated = { ...prev };
          delete updated[uploadId];
          return updated;
        });
      }, 2000);

      console.log(`KYCStep: Successfully uploaded ${type} document`);
    } catch (err) {
      console.error(`KYCStep: Failed to upload ${type} document:`, err);
      setError(
        err instanceof Error ? err.message : "Failed to upload document",
      );
      setUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[uploadId];
        return updated;
      });
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    setKycData((prev: KYCData) => ({
      ...prev,
      documents: prev.documents.filter(
        (doc: KYCDocument) => doc.id !== documentId,
      ),
    }));
  };

  const validateKYC = () => {
    const requiredDocTypes: DocumentType[] = ["identity", "address"];
    const uploadedTypes = kycData.documents.map((doc: KYCDocument) => doc.type);
    const missingTypes = requiredDocTypes.filter(
      (type) => !uploadedTypes.includes(type),
    );

    if (missingTypes.length > 0) {
      return `Please upload all required documents: ${missingTypes.join(", ")}`;
    }

    const failedUploads = kycData.documents.filter(
      (doc: KYCDocument) => doc.status === "failed",
    );
    if (failedUploads.length > 0) {
      return "Some documents failed to upload. Please try uploading them again.";
    }

    return null;
  };

  const handleNext = async () => {
    console.log("KYCStep: Processing KYC submission", kycData);

    const validationError = validateKYC();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submissionData: KYCData = {
        ...kycData,
        verificationStatus: "under_review",
        submittedAt: new Date().toISOString(),
      };

      await saveKYC(submissionData);
      console.log("KYCStep: Successfully submitted KYC documents");
      onNext();
    } catch (err) {
      console.error("KYCStep: Failed to submit KYC:", err);
      setError(
        err instanceof Error ? err.message : "Failed to submit KYC documents",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDocumentByType = (type: DocumentType) => {
    return kycData.documents.find((doc: KYCDocument) => doc.type === type);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderDocumentUpload = (
    type: DocumentType,
    title: string,
    description: string,
    inputRef: React.RefObject<HTMLInputElement>,
  ) => {
    const document = getDocumentByType(type);
    const isUploading = Object.keys(uploadProgress).some((key) =>
      key.startsWith(type),
    );
    const progress = Object.entries(uploadProgress).find(([key]) =>
      key.startsWith(type),
    )?.[1];

    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>

        {!document && !isUploading && (
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file, type);
                }
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 mb-4"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  role="img"
                  aria-labelledby="upload-icon"
                >
                  <title id="upload-icon">Upload icon</title>
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm font-medium">
                  {t("kyc.clickToUpload") || "Click to upload"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WebP or PDF up to 5MB
                </p>
              </div>
            </button>
          </div>
        )}

        {isUploading && progress !== undefined && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">
                Uploading... {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {document && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-labelledby="success-icon"
                  >
                    <title id="success-icon">Success checkmark</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {document.fileName}
                  </p>
                  <p className="text-xs text-green-600">
                    {formatFileSize(document.fileSize)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDocument(document.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                {t("common.remove") || "Remove"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("kyc.title") || "Identity Verification"}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {t("kyc.subtitle") ||
            "Please upload the required documents for identity verification"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Identity Document */}
        {renderDocumentUpload(
          "identity",
          t("kyc.identityTitle") || "Identity Document",
          t("kyc.identityDescription") ||
            "Upload a clear photo of your government-issued ID (passport, driver's license, or national ID card)",
          idUploadRef as React.RefObject<HTMLInputElement>,
        )}

        {/* Address Proof */}
        {renderDocumentUpload(
          "address",
          t("kyc.addressTitle") || "Proof of Address",
          t("kyc.addressDescription") ||
            "Upload a recent utility bill, bank statement, or official document showing your address (not older than 3 months)",
          addressUploadRef as React.RefObject<HTMLInputElement>,
        )}
      </div>

      {/* KYC Status */}
      {kycData.submittedAt && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-labelledby="info-icon"
              >
                <title id="info-icon">Information icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                {t("kyc.statusTitle") || "Verification Status"}
              </h4>
              <p className="text-sm text-blue-700">
                {kycData.verificationStatus === "under_review" &&
                  (t("kyc.underReview") || "Your documents are under review")}
                {kycData.verificationStatus === "approved" &&
                  (t("kyc.approved") || "Your identity has been verified")}
                {kycData.verificationStatus === "rejected" &&
                  (t("kyc.rejected") ||
                    "Verification failed - please upload new documents")}
                {kycData.verificationStatus === "pending" &&
                  (t("kyc.pending") || "Please upload required documents")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">
          {t("kyc.importantNotesTitle") || "Important Notes"}
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
          <li>
            {t("kyc.note1") ||
              "Documents must be clear and all corners visible"}
          </li>
          <li>
            {t("kyc.note2") || "Make sure all text is readable and not blurred"}
          </li>
          <li>{t("kyc.note3") || "Documents must be valid and not expired"}</li>
          <li>
            {t("kyc.note4") || "Address proof must not be older than 3 months"}
          </li>
          <li>
            {t("kyc.note5") ||
              "Personal information must match your profile data"}
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          {t("common.previous") || "Previous"}
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting || Object.keys(uploadProgress).length > 0}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            !isSubmitting && Object.keys(uploadProgress).length === 0
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting
            ? t("common.processing") || "Processing..."
            : Object.keys(uploadProgress).length > 0
              ? t("kyc.uploading") || "Uploading..."
              : t("common.continue") || "Continue"}
        </button>
      </div>
    </div>
  );
}
