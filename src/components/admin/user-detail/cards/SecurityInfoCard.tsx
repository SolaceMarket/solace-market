"use client";

import type { AdminUserDetailProps } from "../types";
import { formatDate } from "../utils";

export default function SecurityInfoCard({
  user,
  onEdit,
}: Pick<AdminUserDetailProps, "user" | "onEdit">) {
  if (!user.security) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Security Information
        </h2>
        <button
          type="button"
          onClick={() => onEdit("security")}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Edit
        </button>
      </div>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm font-medium text-gray-500">2FA Method</dt>
          <dd className="text-sm text-gray-900">
            {user.security.twoFA.method}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">2FA Status</dt>
          <dd>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.security.twoFA.enabled
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.security.twoFA.enabled ? "Enabled" : "Disabled"}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Enabled At</dt>
          <dd className="text-sm text-gray-900">
            {formatDate(user.security.twoFA.enabledAt)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
