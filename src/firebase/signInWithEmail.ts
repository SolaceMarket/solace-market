import { auth } from "./InitializeFirebase";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { sendSignInLinkToEmail } from "firebase/auth";

export const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  //   url: "https://www.example.com/finishSignUp?cartId=1234",
  url: "http://localhost:3000/demo/firebase",
  // This must be true.
  handleCodeInApp: true,
  //   iOS: {
  //     bundleId: "com.example.ios",
  //   },
  //   android: {
  //     packageName: "com.example.android",
  //     installApp: true,
  //     minimumVersion: "12",
  //   },
  //   // The domain must be configured in Firebase Hosting and owned by the project.
  //   linkDomain: "localhost",
};

export function passwordlessEmailSignIn(email: string) {
  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem("emailForSignIn", email);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
}

export function completePasswordlessEmailSignIn() {
  // Confirm the link is a sign-in with email link.
  if (isSignInWithEmailLink(auth, window.location.href)) {
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt("Please provide your email for confirmation");
    }

    if (!email) {
      // User did not provide email.
      console.error("Email is required to complete sign-in.");
      return;
    }

    // The client SDK will parse the code from the link for you.
    signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        console.log("Successfully signed in", result, JSON.stringify(result));

        // Clear email from storage.
        window.localStorage.removeItem("emailForSignIn");
        // You can access the new user by importing getAdditionalUserInfo
        // and calling it with result:
        // getAdditionalUserInfo(result)
        // You can access the user's profile via:
        // getAdditionalUserInfo(result)?.profile
        // You can check if the user is new or existing:
        // getAdditionalUserInfo(result)?.isNewUser
      })
      .catch((error) => {
        console.error(
          "Error signing in with email link",
          error,
          JSON.stringify(error),
        );
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      });
  }
}
