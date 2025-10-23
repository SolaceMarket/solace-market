import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import type { Locale } from "@/types/onboarding";

interface OnboardingPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const params = await searchParams;
  const locale: Locale = (params.locale === "en" ? "en" : "de") as Locale;

  return <OnboardingWizard locale={locale} />;
}
