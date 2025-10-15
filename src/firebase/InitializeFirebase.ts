// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY env var");
}

const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
if (!authDomain) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN env var");
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID env var");
}

const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
if (!storageBucket) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET env var");
}

const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
if (!messagingSenderId) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID env var");
}

const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
if (!appId) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_APP_ID env var");
}

const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
if (!measurementId) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID env var");
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// export const analytics = getAnalytics(app);
