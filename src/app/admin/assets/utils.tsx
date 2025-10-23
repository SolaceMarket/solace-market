import React from "react";
import { AssetStatus } from "./types";

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const getStatusBadge = (status: string): React.ReactElement => {
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
    delisted: "bg-gray-100 text-gray-800",
  };

  const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const getBooleanBadge = (
  value: boolean | undefined,
  label: string,
): React.ReactElement | null => {
  if (value === undefined) return null;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {value ? `✓ ${label}` : `✗ Not ${label}`}
    </span>
  );
};

export const copyToClipboard = (
  text: string,
  successMessage: string = "Copied to clipboard!",
): void => {
  navigator.clipboard.writeText(text);
  alert(successMessage);
};

// Alternative date format for list views
export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Status badge for table view (smaller)
export const getStatusBadgeSmall = (status: string): React.ReactElement => {
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
    delisted: "bg-gray-100 text-gray-800",
  };

  const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {status}
    </span>
  );
};

// Tradability badge
export const getTradableBadge = (tradable: boolean): React.ReactElement => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        tradable ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {tradable ? "Tradable" : "Non-tradable"}
    </span>
  );
};
