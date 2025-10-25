import { PortfolioPage } from "@/components/pages/portfolio/PortfolioPage";
import { getAuthenticatedAppForUser } from "@/firebase/getAuthenticatedAppForUser";
import { redirect } from "next/navigation";

// Mark this page as dynamic since it uses cookies
export const dynamic = "force-dynamic";

export default async function Portfolio() {
  try {
    const { currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser) {
      redirect("/demo/firebase"); // Redirect to login
    }

    return <PortfolioPage userId={currentUser.uid} />;
  } catch (error) {
    console.error("Error accessing portfolio:", error);
    redirect("/demo/firebase"); // Redirect to login on error
  }
}
