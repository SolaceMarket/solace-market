import { getAuthenticatedAppForUser } from "@/firebase/getAuthenticatedAppForUser";

export async function FirebaseDemoSSRPage() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  return (
    <div>
      <h1>Firebase Demo SSR Page</h1>
      <pre>{JSON.stringify(currentUser, null, 2)}</pre>
    </div>
  );
}
