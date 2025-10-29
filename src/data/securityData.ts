export interface SecuritySettings {
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  backupCodesGenerated: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
  deviceTrust: boolean;
  email: string;
  lastPasswordChange: string;
}

export const defaultSecuritySettings: SecuritySettings = {
  emailVerified: false,
  twoFactorEnabled: false,
  backupCodesGenerated: false,
  sessionTimeout: 30, // minutes
  loginNotifications: true,
  deviceTrust: true,
  email: "",
  lastPasswordChange: "Never",
};

export const getSecurityScore = (
  settings: SecuritySettings,
  isConnected: boolean,
): number => {
  let score = 0;
  if (settings.emailVerified) score += 25;
  if (settings.twoFactorEnabled) score += 30;
  if (settings.backupCodesGenerated) score += 15;
  if (isConnected) score += 20;
  if (settings.loginNotifications) score += 10;
  return score;
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};
