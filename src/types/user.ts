/**
 * User-related types and interfaces
 *
 * This file contains all user data structures and related interfaces.
 */

import type {
  OnboardingStep,
  ExperienceLevel,
  KYCStatus,
  KYCLevel,
  KYCRiskLevel,
  KYCProvider,
  BrokerStatus,
  BrokerProvider,
  TwoFAMethod,
  Theme,
  DefaultQuote,
  Locale,
  Jurisdiction,
  BlockchainType,
  DocumentType,
  DocumentStatus,
} from "./base";

// Consent information
export interface ConsentInfo {
  version: string;
  acceptedAt: string;
}

// User consents
export interface UserConsents {
  tos: ConsentInfo;
  privacy: ConsentInfo;
  risk: ConsentInfo;
}

// User profile information
export interface UserProfile {
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
  taxResidency: string;
  address: string;
  phone?: string;
  experience: ExperienceLevel;
}

// KYC document information
export interface KYCDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
  status: DocumentStatus;
  expiresAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  
  // Document analysis results
  analysis?: {
    confidence: number;
    extractedData?: Record<string, unknown>;
    issueCountry?: string;
    documentNumber?: string;
    issuedDate?: string;
    expiryDate?: string;
    verified: boolean;
  };
  
  // Fraud detection
  fraudChecks?: {
    tampered: boolean;
    photoSubstitution: boolean;
    digitalDocument: boolean;
    validFormat: boolean;
    confidence: number;
  };
}

// KYC verification data
export interface KYCData {
  documents: KYCDocument[];
  verificationStatus: KYCStatus | "under_review";
  submittedAt: string | null;
}

// KYC verification checks
export interface KYCCheck {
  type: string;
  status: KYCStatus;
  checkedAt: string;
  score?: number; // 0-100 confidence score
  details?: string;
  provider?: string;
}

// AML/Sanctions screening result
export interface AMLScreeningResult {
  status: "clear" | "flagged" | "pending";
  checkedAt: string;
  provider: string;
  matches?: Array<{
    type: "sanctions" | "pep" | "adverse_media";
    name: string;
    country: string;
    confidence: number;
    details: string;
  }>;
}

// KYC verification information
export interface UserKYC {
  provider: KYCProvider;
  status: KYCStatus;
  level: KYCLevel;
  riskLevel: KYCRiskLevel;
  lastCheckedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  expiresAt?: string;
  rejectionReason?: string;
  externalId?: string; // Provider's reference ID
  
  // Documents
  documents?: KYCDocument[];
  
  // Individual verification checks
  checks: {
    identity?: KYCCheck;
    address?: KYCCheck;
    sanctions?: KYCCheck;
    pep?: KYCCheck; // Politically Exposed Person
    biometric?: KYCCheck;
    liveness?: KYCCheck;
  };
  
  // AML screening results
  amlScreening?: AMLScreeningResult;
  
  // Additional metadata
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
  
  // Compliance notes (admin only)
  complianceNotes?: Array<{
    timestamp: string;
    author: string;
    note: string;
    type: "info" | "warning" | "critical";
  }>;
  
  // Review information
  reviewedBy?: string;
  reviewedAt?: string;
  nextReviewDue?: string;
}

// Wallet connection information
export interface UserWallet {
  chain: BlockchainType;
  publicKey: string;
  verifiedAt: string;
  isGenerated?: boolean; // True if wallet was generated for user
}

// Brokerage account information
export interface UserBroker {
  provider: BrokerProvider;
  subAccountId: string;
  status: BrokerStatus;
  createdAt: string;
  lastSyncAt?: string;
}

// Security settings
export interface UserSecurity {
  twoFA: {
    method: TwoFAMethod;
    enabled: boolean;
    enabledAt: string;
  };
}

// User preferences
export interface UserPreferences {
  news: boolean;
  orderFills: boolean;
  riskAlerts: boolean;
  statements: boolean;
  theme: Theme;
  defaultQuote: DefaultQuote;
  hintsEnabled: boolean;
}

// Onboarding state
export interface OnboardingState {
  startedAt: string;
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  completed: boolean;
  completedAt?: string;
  lastActivityAt: string;
}

// Main user document interface
export interface User {
  uid: string;
  email: string;
  createdAt: string;
  locale: Locale;
  jurisdiction: Jurisdiction;
  onboarding: OnboardingState;
  consents?: UserConsents;
  profile?: UserProfile;
  kyc?: UserKYC;
  wallet?: UserWallet;
  broker?: UserBroker;
  security?: UserSecurity;
  preferences?: UserPreferences;
}

// Step completion tracking
export interface StepProgress {
  step: OnboardingStep;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
  data?: Record<string, unknown>; // Step-specific data
}

// Onboarding analytics events
export interface OnboardingEvent {
  event: string;
  uid: string;
  step: OnboardingStep;
  timestamp: string;
  properties?: Record<string, unknown>;
}
