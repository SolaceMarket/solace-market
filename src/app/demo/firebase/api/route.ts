import { getAuthenticatedAppForUser } from "@/firebase/getAuthenticatedAppForUser";

export async function GET(request: Request) {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  return new Response(JSON.stringify(currentUser), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
