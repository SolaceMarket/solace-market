"use client";

import type { DetailedUser } from "./types";

interface AlpacaAccountCardProps {
  user: DetailedUser;
  onRefresh?: () => void;
}

export default function AlpacaAccountCard({
  user,
  onRefresh,
}: AlpacaAccountCardProps) {
  // Mock Alpaca account data for now - in real implementation, fetch from API
  const alpacaAccount = {
    id: "d0833dbb-27fb-4e17-ae54-a330c5e7956e",
    accountNumber: "966816098",
    status: "ACTIVE" as const,
    cryptoStatus: "ACTIVE" as const,
    kycSummary: "pass" as const,
    currency: "USD",
    lastEquity: "0",
    createdAt: "2025-10-16T00:29:25.239637Z",
    accountType: "trading",
    tradingType: "margin",
    enabledAssets: ["us_equity", "crypto"],
    investmentObjective: "market_speculation",
    riskTolerance: "conservative",
  };

  const contact = {
    emailAddress: user.email,
    phoneNumber: "+15556667788",
    streetAddress: ["20 N San Mateo Dr"],
    city: "San Mateo",
    state: "CA",
    postalCode: "94401",
    country: "USA",
  };

  const identity = {
    givenName: user.profile?.firstName || "John",
    familyName: user.profile?.lastName || "Doe",
    dateOfBirth: "1990-01-01",
    countryOfCitizenship: "AUS",
    maritalStatus: "MARRIED",
    numberOfDependents: 5,
    investmentExperience: "over_5_years",
    riskTolerance: "conservative",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Alpaca Markets Account
        </h3>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Refresh
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Account Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Account Number
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              #{alpacaAccount.accountNumber}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Account Status
            </dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  alpacaAccount.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {alpacaAccount.status}
              </span>
            </dd>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Crypto Status</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  alpacaAccount.cryptoStatus === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {alpacaAccount.cryptoStatus}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">KYC Status</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  alpacaAccount.kycSummary === "pass"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {alpacaAccount.kycSummary.toUpperCase()}
              </span>
            </dd>
          </div>
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Currency</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {alpacaAccount.currency}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Last Equity</dt>
            <dd className="mt-1 text-sm text-gray-900">
              ${alpacaAccount.lastEquity}
            </dd>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Account Type</dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">
              {alpacaAccount.accountType}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Trading Type</dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">
              {alpacaAccount.tradingType}
            </dd>
          </div>
        </div>

        {/* Enabled Assets */}
        <div>
          <dt className="text-sm font-medium text-gray-500">Enabled Assets</dt>
          <dd className="mt-1 flex flex-wrap gap-1">
            {alpacaAccount.enabledAssets.map((asset) => (
              <span
                key={asset}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
              >
                {asset}
              </span>
            ))}
          </dd>
        </div>

        {/* Contact Information */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Contact Information
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>{" "}
              {contact.emailAddress}
            </div>
            <div>
              <span className="text-gray-500">Phone:</span>{" "}
              {contact.phoneNumber}
            </div>
            <div>
              <span className="text-gray-500">Address:</span>{" "}
              {contact.streetAddress[0]}
            </div>
            <div>
              <span className="text-gray-500">Location:</span> {contact.city},{" "}
              {contact.state} {contact.postalCode}
            </div>
          </div>
        </div>

        {/* Identity Information */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Identity Information
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Name:</span> {identity.givenName}{" "}
              {identity.familyName}
            </div>
            <div>
              <span className="text-gray-500">Date of Birth:</span>{" "}
              {identity.dateOfBirth}
            </div>
            <div>
              <span className="text-gray-500">Citizenship:</span>{" "}
              {identity.countryOfCitizenship}
            </div>
            <div>
              <span className="text-gray-500">Marital Status:</span>{" "}
              {identity.maritalStatus}
            </div>
            <div>
              <span className="text-gray-500">Dependents:</span>{" "}
              {identity.numberOfDependents}
            </div>
            <div>
              <span className="text-gray-500">Risk Tolerance:</span>{" "}
              {identity.riskTolerance}
            </div>
          </div>
        </div>

        {/* Account ID for reference */}
        <div className="border-t pt-4">
          <div className="text-xs text-gray-400">
            Account ID: {alpacaAccount.id}
          </div>
          <div className="text-xs text-gray-400">
            Created: {new Date(alpacaAccount.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
