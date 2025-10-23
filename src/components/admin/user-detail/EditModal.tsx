"use client";

import { useState, useEffect } from "react";
import type { EditMode, DetailedUser } from "./types";
import {
  EditModalLayout,
  OnboardingEditForm,
  KYCEditForm,
  PreferencesEditForm,
} from "./forms";

interface EditModalProps {
  mode: EditMode;
  user?: DetailedUser | null;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}

export default function EditModal({ mode, user, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize form data based on mode and user data
    if (mode && user) {
      switch (mode) {
        case "preferences":
          setFormData({
            theme: user.preferences?.theme || "",
            defaultQuote: user.preferences?.defaultQuote || "",
            hintsEnabled: user.preferences?.hintsEnabled || false,
            news: user.preferences?.news || false,
            orderFills: user.preferences?.orderFills || false,
            riskAlerts: user.preferences?.riskAlerts || false,
            statements: user.preferences?.statements || false,
          });
          break;
        case "kyc":
          setFormData({
            status: user.kyc?.status || "",
            level: user.kyc?.level || "",
            riskLevel: user.kyc?.riskLevel || "",
            provider: user.kyc?.provider || "",
            reviewedAt: user.kyc?.reviewedAt || "",
            nextReviewDue: user.kyc?.nextReviewDue || "",
            rejectionReason: user.kyc?.rejectionReason || "",
            complianceNote: "",
            noteType: "info",
          });
          break;
        case "onboarding":
          setFormData({
            currentStep: user.onboarding?.currentStep || "",
            completed: user.onboarding?.completed || false,
          });
          break;
        default:
          setFormData({});
      }
    } else {
      setFormData({});
    }
  }, [mode, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  if (!mode) return null;

  const renderForm = () => {
    switch (mode) {
      case "onboarding":
        return (
          <OnboardingEditForm formData={formData} setFormData={setFormData} />
        );
      case "kyc":
        return <KYCEditForm formData={formData} setFormData={setFormData} />;
      case "preferences":
        return (
          <PreferencesEditForm formData={formData} setFormData={setFormData} />
        );
      default:
        return (
          <p className="text-sm text-gray-600 mb-4">
            Editing functionality for {mode} will be implemented here. This is
            a placeholder modal.
          </p>
        );
    }
  };

  return (
    <EditModalLayout
      mode={mode}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
    >
      {renderForm()}
    </EditModalLayout>
  );
}
