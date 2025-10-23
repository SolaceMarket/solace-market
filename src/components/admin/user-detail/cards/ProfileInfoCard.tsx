"use client";

import type { AdminUserDetailProps } from "../types";

export default function ProfileInfoCard({
  user,
  onEdit,
}: Pick<AdminUserDetailProps, "user" | "onEdit">) {
  if (!user.profile) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Profile Information
        </h2>
        <button
          type="button"
          onClick={() => onEdit("profile")}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Edit
        </button>
      </div>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm font-medium text-gray-500">Name</dt>
          <dd className="text-sm text-gray-900">
            {user.profile.firstName} {user.profile.lastName}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
          <dd className="text-sm text-gray-900">{user.profile.dob}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Country</dt>
          <dd className="text-sm text-gray-900">{user.profile.country}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Tax Residency</dt>
          <dd className="text-sm text-gray-900">{user.profile.taxResidency}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Address</dt>
          <dd className="text-sm text-gray-900">{user.profile.address}</dd>
        </div>
        {user.profile.phone && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="text-sm text-gray-900">{user.profile.phone}</dd>
          </div>
        )}
        <div>
          <dt className="text-sm font-medium text-gray-500">Experience</dt>
          <dd className="text-sm text-gray-900">{user.profile.experience}</dd>
        </div>
      </dl>
    </div>
  );
}
