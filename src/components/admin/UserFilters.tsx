import type { UserFilters } from "@/types/admin";

interface UserFiltersProps {
  filters: UserFilters;
  onFilterChange: (key: string, value: string) => void;
}

export default function UserFiltersComponent({
  filters,
  onFilterChange,
}: UserFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="search-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Search (email, UID, wallet)
          </label>
          <input
            id="search-input"
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search users..."
          />
        </div>
        <div>
          <label
            htmlFor="status-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Onboarding Status
          </label>
          <select
            id="status-select"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="welcome">Welcome</option>
            <option value="consents">Consents</option>
            <option value="profile">Profile</option>
            <option value="kyc">KYC</option>
            <option value="wallet">Wallet</option>
            <option value="broker">Broker</option>
            <option value="security">Security</option>
            <option value="preferences">Preferences</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="jurisdiction-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Jurisdiction
          </label>
          <select
            id="jurisdiction-select"
            value={filters.jurisdiction}
            onChange={(e) => onFilterChange("jurisdiction", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Jurisdictions</option>
            <option value="DE">Germany</option>
            <option value="EU">European Union</option>
            <option value="US">United States</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
