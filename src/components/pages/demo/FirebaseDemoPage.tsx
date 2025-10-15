import { useEffect, useState } from "react";
import { auth } from "@/firebase/InitializeFirebase";
import {
  completePasswordlessEmailSignIn,
  passwordlessEmailSignIn,
} from "@/firebase/signInWithEmail";
// import { onAuthStateChanged } from "firebase/auth";
import { useUserSession } from "@/firebase/useUserSession";

export function FirebaseDemoPage() {
  const [email, setEmail] = useState("");
  const [loading, userSession] = useUserSession();

  useEffect(() => {
    if (auth.currentUser?.emailVerified) {
      console.log("User already signed in");
      return;
    }
    completePasswordlessEmailSignIn();
  }, []);

  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/auth.user
  //     const uid = user.uid;

  //     console.log("User signed in with uid:", uid);
  //     // ...
  //   } else {
  //     // User is signed out
  //     // ...
  //     console.log("User signed out");
  //   }
  // });

  async function mockApiCall() {
    try {
      const response = await fetch("/demo/firebase/api", {
        method: "GET",
      });
      const data = await response.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("API Call Error:", error);
    }
  }

  return (
    <div>
      <h1>Firebase Demo Page</h1>

      {loading && <p>Loading...</p>}

      {!loading && userSession && (
        <div>
          <div>
            <p>Email is verified. You can access protected content.</p>
            <pre>{JSON.stringify(userSession, null, 2)}</pre>
          </div>

          <button type="button" onClick={() => mockApiCall()}>
            Call Mock API
          </button>

          <button type="button" onClick={() => auth.signOut()}>
            Sign Out
          </button>
        </div>
      )}

      {!loading && !userSession && (
        <div>
          <p>Please sign in with your email:</p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <button type="button" onClick={() => passwordlessEmailSignIn(email)}>
            Sign in with Email Link
          </button>
        </div>
      )}
    </div>
  );
}
