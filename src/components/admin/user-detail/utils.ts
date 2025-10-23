export const formatDate = (dateString?: string) => {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    // General statuses
    completed: "bg-green-100 text-green-800",
    approved: "bg-green-100 text-green-800",
    active: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    error: "bg-red-100 text-red-800",
    
    // KYC specific statuses
    not_started: "bg-gray-100 text-gray-800",
    under_review: "bg-blue-100 text-blue-800",
    requires_more: "bg-orange-100 text-orange-800",
    expired: "bg-purple-100 text-purple-800",
    flagged: "bg-red-100 text-red-800",
    
    // Document statuses
    uploaded: "bg-blue-100 text-blue-800",
    processing: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    corrupted: "bg-red-100 text-red-800",
    
    // AML statuses
    clear: "bg-green-100 text-green-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export const getRiskLevelColor = (riskLevel: string) => {
  const colors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800", 
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };
  return colors[riskLevel] || "bg-gray-100 text-gray-800";
};

export const getKYCLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    basic: "bg-blue-100 text-blue-800",
    enhanced: "bg-purple-100 text-purple-800",
    premium: "bg-gold-100 text-gold-800",
  };
  return colors[level] || "bg-gray-100 text-gray-800";
};

export const formatConfidenceScore = (score?: number) => {
  if (score === undefined) return "N/A";
  return `${score}%`;
};

export const getProviderDisplayName = (provider: string) => {
  const providers: Record<string, string> = {
    mock: "Mock Provider",
    jumio: "Jumio",
    onfido: "Onfido", 
    persona: "Persona",
    veriff: "Veriff",
    sumsub: "Sum&Substance",
    shufti_pro: "Shufti Pro",
    trulioo: "Trulioo",
    au10tix: "AU10TIX",
  };
  return providers[provider] || provider;
};
