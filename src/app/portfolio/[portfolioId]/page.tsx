import { PortfolioPage } from "@/components/pages/portfolio/PortfolioPage";
import { getAuthenticatedAppForUser } from "@/firebase/getAuthenticatedAppForUser";
import { redirect } from "next/navigation";

interface PortfolioPageProps {
  params: Promise<{ portfolioId: string }>;
}

export default async function Portfolio({ params }: PortfolioPageProps) {
  const { portfolioId } = await params;

  try {
    const { currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser) {
      redirect("/demo/firebase"); // Redirect to login
    }

    return <PortfolioPage userId={currentUser.uid} portfolioId={portfolioId} />;
  } catch (error) {
    console.error("Error accessing portfolio:", error);
    redirect("/demo/firebase"); // Redirect to login on error
  }
}
