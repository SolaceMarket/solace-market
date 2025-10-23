"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import type { OnboardingStep, Locale } from "@/types/onboarding";

// Import the separated components
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingStepper } from "./OnboardingStepper";
import { OnboardingContent } from "./OnboardingContent";
import { OnboardingLoading } from "./OnboardingLoading";
import { OnboardingError } from "./OnboardingError";

interface OnboardingWizardProps {
  locale: Locale;
}

const stepOrder: OnboardingStep[] = [
  "welcome",
  "consents",
  "profile",
  "kyc",
  "wallet",
  "broker",
  "security",
  "preferences",
  "tour",
  "done",
];

export function OnboardingWizard({ locale }: OnboardingWizardProps) {
  const router = useRouter();
  const {
    user,
    loading,
    error,
    isStepCompleted,
    isStepAccessible,
    updateStep,
  } = useOnboardingState();

  const [activeStep, setActiveStep] = useState<OnboardingStep>("welcome");

  // Update active step when user data changes
  useEffect(() => {
    if (user?.onboarding.currentStep) {
      setActiveStep(user.onboarding.currentStep);
    }
  }, [user?.onboarding.currentStep]);

  // Redirect to dashboard if onboarding is complete
  useEffect(() => {
    if (user?.onboarding.completed) {
      router.push("/portfolio");
    }
  }, [user?.onboarding.completed, router]);

  const getStepIndex = (step: OnboardingStep) => stepOrder.indexOf(step);
  const getCurrentStepIndex = () => getStepIndex(activeStep);

  const navigateToStep = (step: OnboardingStep) => {
    if (isStepAccessible(step)) {
      setActiveStep(step);
    }
  };

  const goToNextStep = async () => {
    console.log("OnboardingWizard: goToNextStep called");
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < stepOrder.length - 1) {
      const currentStep = stepOrder[currentIndex];
      const nextStep = stepOrder[currentIndex + 1];

      console.log("Advancing from", currentStep, "to", nextStep);

      try {
        // Complete the current step and advance to next step
        await updateStep(currentStep, true);
        await updateStep(nextStep, false);

        // // Mark current step as completed if it's the welcome step
        // if (currentStep === "welcome") {
        //   await updateStep("welcome", true);
        // }

        setActiveStep(nextStep);
        console.log("Successfully advanced to", nextStep);
      } catch (error) {
        console.error("Failed to advance to next step:", error);
      }
    } else {
      console.log("Already at the last step");
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      const prevStep = stepOrder[currentIndex - 1];
      setActiveStep(prevStep);
    }
  };

  if (loading) {
    return <OnboardingLoading locale={locale} />;
  }

  if (error) {
    return <OnboardingError locale={locale} error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OnboardingHeader locale={locale} activeStep={activeStep} />

      <OnboardingStepper
        locale={locale}
        activeStep={activeStep}
        isStepCompleted={isStepCompleted}
        isStepAccessible={isStepAccessible}
        onNavigateToStep={navigateToStep}
      />

      <OnboardingContent
        locale={locale}
        activeStep={activeStep}
        onNext={goToNextStep}
        onPrevious={goToPreviousStep}
      />
    </div>
  );
}
