import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "@/firebase/InitializeFirebase";
import type {
  User,
  OnboardingStep,
  UserConsents,
  UserProfile,
  UserKYC,
  UserWallet,
  UserBroker,
  UserSecurity,
  UserPreferences,
  Jurisdiction,
  Locale,
} from "@/types/onboarding";

// Get user document
export async function getUser(uid: string): Promise<User | null> {
  try {
    const userRef = doc(firestore, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      // Convert Firestore timestamps to ISO strings
      return {
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        onboarding: {
          ...data.onboarding,
          startedAt:
            data.onboarding?.startedAt?.toDate?.()?.toISOString() ||
            data.onboarding?.startedAt,
          completedAt:
            data.onboarding?.completedAt?.toDate?.()?.toISOString() ||
            data.onboarding?.completedAt,
          lastActivityAt:
            data.onboarding?.lastActivityAt?.toDate?.()?.toISOString() ||
            data.onboarding?.lastActivityAt,
        },
      } as User;
    }

    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("Failed to get user");
  }
}

// Create initial user document
export async function createUser(
  uid: string,
  email: string,
  locale: Locale = "de",
): Promise<User> {
  try {
    const userRef = doc(firestore, "users", uid);

    // Check if user already exists
    const existingUser = await getUser(uid);
    if (existingUser) {
      return existingUser;
    }

    const now = new Date().toISOString();
    const userData: User = {
      uid,
      email,
      createdAt: now,
      locale,
      jurisdiction: "EU", // Will be updated in profile step
      onboarding: {
        startedAt: now,
        currentStep: "welcome",
        completedSteps: [],
        completed: false,
        lastActivityAt: now,
      },
    };

    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      onboarding: {
        ...userData.onboarding,
        startedAt: serverTimestamp(),
        lastActivityAt: serverTimestamp(),
      },
    });

    return userData;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

// Update onboarding step
export async function updateOnboardingStep(
  uid: string,
  step: OnboardingStep,
  completed: boolean = false,
): Promise<void> {
  try {
    const userRef = doc(firestore, "users", uid);
    const user = await getUser(uid);

    if (!user) {
      throw new Error("User not found");
    }

    const completedSteps = completed
      ? [...new Set([...user.onboarding.completedSteps, step])]
      : user.onboarding.completedSteps;

    const updateData: Record<string, unknown> = {
      "onboarding.currentStep": step,
      "onboarding.completedSteps": completedSteps,
      "onboarding.lastActivityAt": serverTimestamp(),
    };

    // Mark onboarding as complete if on final step
    if (step === "done" && completed) {
      updateData["onboarding.completed"] = true;
      updateData["onboarding.completedAt"] = serverTimestamp();
    }

    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error("Error updating onboarding step:", error);
    throw new Error("Failed to update onboarding step");
  }
}

// Save user consents
export async function saveConsents(
  uid: string,
  consents: UserConsents,
): Promise<void> {
  try {
    const userRef = doc(firestore, "users", uid);

    await updateDoc(userRef, {
      consents,
      "onboarding.lastActivityAt": serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving consents:", error);
    throw new Error("Failed to save consents");
  }
}

// Save user profile
export async function saveProfile(
  uid: string,
  profile: UserProfile,
  jurisdiction: Jurisdiction,
): Promise<void> {
  try {
    const userRef = doc(firestore, "users", uid);

    await updateDoc(userRef, {
      profile,
      jurisdiction,
      "onboarding.lastActivityAt": serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    throw new Error("Failed to save profile");
  }
}

// Save KYC information
export async function saveKYC(uid: string, kyc: UserKYC): Promise<void> {
  try {
    const userRef = doc(firestore, "users", uid);

    await updateDoc(userRef, {
      kyc,
      "onboarding.lastActivityAt": serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving KYC:", error);
    throw new Error("Failed to save KYC");
  }
}

// Save wallet information
export async function saveWallet(
  uid: string,
  wallet: UserWallet,
): Promise<void> {
  try {
    const userRef = doc(firestore, "users", uid);

    await updateDoc(userRef, {
      wallet,
      "onboarding.lastActivityAt": serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving wallet:", error);
    throw new Error("Failed to save wallet");
  }
}

// Save broker information
export async function saveBroker(
  uid: string,
  broker: UserBroker,
): Promise<void> {
  try {
    const userRef = doc(firestore, "users", uid);

    await updateDoc(userRef, {
      broker,
      "onboarding.lastActivityAt": serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving broker:", error);
    throw new Error("Failed to save broker");
  }
}

// Save security information
export async function saveSecurity(
  uid: string,
  security: UserSecurity,
): Promise<void> {
  try {
    const userRef = doc(firestore, "users", uid);

    await updateDoc(userRef, {
      security,
      "onboarding.lastActivityAt": serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving security:", error);
    throw new Error("Failed to save security");
  }
}

// Save preferences
export async function savePreferences(
  uid: string,
  preferences: UserPreferences,
): Promise<void> {
  try {
    const userRef = doc(firestore, "users", uid);

    await updateDoc(userRef, {
      preferences,
      "onboarding.lastActivityAt": serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    throw new Error("Failed to save preferences");
  }
}

// Check if step is accessible (previous steps completed)
export function isStepAccessible(
  user: User,
  targetStep: OnboardingStep,
): boolean {
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

  const targetIndex = stepOrder.indexOf(targetStep);
  const currentIndex = stepOrder.indexOf(user.onboarding.currentStep);

  // Allow going back to completed steps or current step
  if (targetIndex <= currentIndex) {
    return true;
  }

  // Allow advancing one step if current step is completed
  if (
    targetIndex === currentIndex + 1 &&
    user.onboarding.completedSteps.includes(user.onboarding.currentStep)
  ) {
    return true;
  }

  return false;
}

// Get next step in sequence
export function getNextStep(
  currentStep: OnboardingStep,
): OnboardingStep | null {
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

  const currentIndex = stepOrder.indexOf(currentStep);
  if (currentIndex >= 0 && currentIndex < stepOrder.length - 1) {
    return stepOrder[currentIndex + 1];
  }

  return null;
}

// Determine jurisdiction from country
export function getJurisdictionFromCountry(country: string): Jurisdiction {
  const countryUpper = country.toUpperCase();

  if (countryUpper === "DE" || countryUpper === "GERMANY") {
    return "DE";
  }

  // EU countries (simplified list)
  const euCountries = [
    "AT",
    "BE",
    "BG",
    "HR",
    "CY",
    "CZ",
    "DK",
    "EE",
    "FI",
    "FR",
    "GR",
    "HU",
    "IE",
    "IT",
    "LV",
    "LT",
    "LU",
    "MT",
    "NL",
    "PL",
    "PT",
    "RO",
    "SK",
    "SI",
    "ES",
    "SE",
  ];

  if (euCountries.includes(countryUpper)) {
    return "EU";
  }

  if (
    countryUpper === "US" ||
    countryUpper === "USA" ||
    countryUpper === "UNITED STATES"
  ) {
    return "US";
  }

  return "Other";
}
