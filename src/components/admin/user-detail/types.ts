import type { User } from "@/types/onboarding";

export interface DetailedUser extends User {
  firebase?: {
    uid: string;
    email?: string;
    emailVerified: boolean;
    disabled: boolean;
    metadata: {
      creationTime?: string;
      lastSignInTime?: string;
      lastRefreshTime?: string;
    };
    providerData: Array<{
      uid: string;
      email?: string;
      providerId: string;
    }>;
    customClaims?: Record<string, unknown>;
  };
  alpaca?: {
    accountId: string;
    status: string;
  };
}

export type EditMode =
  | "onboarding"
  | "profile"
  | "wallet"
  | "kyc"
  | "broker"
  | "firebase"
  | "security"
  | "preferences"
  | null;

export interface AdminUserDetailProps {
  user: DetailedUser;
  onUpdate: (action: string, data: Record<string, unknown>) => Promise<void>;
  onEdit: (mode: EditMode) => void;
}
