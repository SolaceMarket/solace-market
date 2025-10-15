import { onIdTokenChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./InitializeFirebase";

export function useUserSession(initialUser?: User) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(initialUser || null);

  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      console.log(
        "useUserSession ::: onIdTokenChanged ::: User changed:",
        user,
      );

      if (user) {
        const idToken = await user.getIdToken();
        // await setCookie("__session", idToken);

        console.log("Setting __session cookie with ID token:", idToken);
        await window.cookieStore.set({
          name: "__session",
          value: idToken,
          //   path: "/",
        });
        setUser(user);
      } else {
        // await deleteCookie("__session");

        console.log("Deleting __session cookie");
        await window.cookieStore.delete("__session");
        setUser(null);
      }
      if (initialUser?.uid === user?.uid) {
        return;
      }
      //   window.location.reload();
      setLoading(false);
    });
  }, [initialUser]);

  return [loading, user];
}
