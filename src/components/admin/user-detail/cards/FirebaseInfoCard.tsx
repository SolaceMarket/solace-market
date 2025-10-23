"use client";

import type { AdminUserDetailProps } from "../types";
import { formatDate } from "../utils";

export default function FirebaseInfoCard({
  user,
  onEdit,
}: Pick<AdminUserDetailProps, "user" | "onEdit">) {
  if (!user.firebase) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Firebase Information
        </h2>
        <button
          type="button"
          onClick={() => onEdit("firebase")}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Edit
        </button>
      </div>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
          <dd className="text-sm text-gray-900">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.firebase.emailVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.firebase.emailVerified ? "Verified" : "Not Verified"}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">
            Account Disabled
          </dt>
          <dd className="text-sm text-gray-900">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.firebase.disabled
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {user.firebase.disabled ? "Disabled" : "Active"}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Creation Time</dt>
          <dd className="text-sm text-gray-900">
            {formatDate(user.firebase.metadata.creationTime)}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Last Sign In</dt>
          <dd className="text-sm text-gray-900">
            {formatDate(user.firebase.metadata.lastSignInTime)}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Last Refresh</dt>
          <dd className="text-sm text-gray-900">
            {formatDate(user.firebase.metadata.lastRefreshTime)}
          </dd>
        </div>
        {user.firebase.providerData.length > 0 && (
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Auth Providers
            </dt>
            <dd className="text-sm text-gray-900">
              {user.firebase.providerData.map((p) => p.providerId).join(", ")}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
