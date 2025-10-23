"use client";

import type { AdminUserDetailProps } from "../types";
import { formatDate } from "../utils";

export default function BasicInfoCard({
  user,
}: Pick<AdminUserDetailProps, "user">) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Basic Information
        </h2>
      </div>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm font-medium text-gray-500">Email</dt>
          <dd className="text-sm text-gray-900">{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">UID</dt>
          <dd className="text-sm text-gray-900 font-mono">{user.uid}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Created</dt>
          <dd className="text-sm text-gray-900">
            {formatDate(user.createdAt)}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Locale</dt>
          <dd className="text-sm text-gray-900">{user.locale.toUpperCase()}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Jurisdiction</dt>
          <dd className="text-sm text-gray-900">{user.jurisdiction}</dd>
        </div>
      </dl>
    </div>
  );
}
