"use client";

import type { AdminUserDetailProps } from "../types";
import { PreferencesQuickSummary } from "../PreferencesBadges";

export default function PreferencesCard({
  user,
  onEdit,
}: Pick<AdminUserDetailProps, "user" | "onEdit">) {
  if (!user.preferences) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
        <button
          type="button"
          onClick={() => onEdit("preferences")}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Edit
        </button>
      </div>
      
      {/* Quick Summary Badges */}
      <div className="mb-4">
        <PreferencesQuickSummary preferences={user.preferences} />
      </div>
      
      <dl className="space-y-3">
        <div>
          <dt className="text-sm font-medium text-gray-500">Theme</dt>
          <dd className="text-sm text-gray-900">{user.preferences.theme}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">
            Default Quote Currency
          </dt>
          <dd className="text-sm text-gray-900">
            {user.preferences.defaultQuote}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Notifications</dt>
          <dd className="text-sm text-gray-900">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>News: {user.preferences.news ? "✓" : "✗"}</div>
              <div>Order Fills: {user.preferences.orderFills ? "✓" : "✗"}</div>
              <div>Risk Alerts: {user.preferences.riskAlerts ? "✓" : "✗"}</div>
              <div>Statements: {user.preferences.statements ? "✓" : "✗"}</div>
            </div>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Hints Enabled</dt>
          <dd className="text-sm text-gray-900">
            {user.preferences.hintsEnabled ? "Yes" : "No"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
