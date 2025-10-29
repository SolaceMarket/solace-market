export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  totalInvested: string;
  portfolioValue: string;
  totalGains: string;
  riskTolerance: "Conservative" | "Moderate" | "Aggressive" | "Not Set";
  preferredAssets: string[];
  kycStatus: "Verified" | "Pending" | "Not Started";
  hasCompletedProfile: boolean;
}

// Default anonymous user profile - for new users who connect with wallet only
export const defaultUserProfile: UserProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  joinDate: "October 2024", // This would be set when wallet first connects
  totalInvested: "$0.00",
  portfolioValue: "$0.00",
  totalGains: "$0.00 (0.00%)",
  riskTolerance: "Not Set",
  preferredAssets: [],
  kycStatus: "Not Started",
  hasCompletedProfile: false,
};

// Demo user profile - for testing with filled out data
export const demoUserProfile: UserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  joinDate: "March 2024",
  totalInvested: "$12,450.00",
  portfolioValue: "$13,678.45",
  totalGains: "+$1,228.45 (9.86%)",
  riskTolerance: "Moderate",
  preferredAssets: ["Tech Stocks", "Crypto", "ETFs"],
  kycStatus: "Verified",
  hasCompletedProfile: true,
};

// Switch between profiles for testing
// Change this to switch between anonymous and demo user
export const getCurrentProfile = (): UserProfile => {
  // Return defaultUserProfile for anonymous user experience
  // Return demoUserProfile for testing with filled data
  //   return defaultUserProfile;

  // Uncomment the line below and comment the line above to use demo data:
  return demoUserProfile;
};
