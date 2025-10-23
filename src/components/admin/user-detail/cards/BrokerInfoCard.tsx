"use client";

import type { AdminUserDetailProps } from "../types";
import { formatDate, getStatusColor } from "../utils";

export default function BrokerInfoCard({
  user,
  onEdit,
}: Pick<AdminUserDetailProps, "user" | "onEdit">) {
  if (!user.broker) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Broker Information
        </h2>
        <button
          type="button"
          onClick={() => onEdit("broker")}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Edit
        </button>
      </div>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm font-medium text-gray-500">Provider</dt>
          <dd className="text-sm text-gray-900">{user.broker.provider}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Sub Account ID</dt>
          <dd className="text-sm text-gray-900 font-mono">
            {user.broker.subAccountId}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Status</dt>
          <dd>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.broker.status)}`}
            >
              {user.broker.status}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Created At</dt>
          <dd className="text-sm text-gray-900">
            {formatDate(user.broker.createdAt)}
          </dd>
        </div>
        {user.broker.lastSyncAt && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Last Sync</dt>
            <dd className="text-sm text-gray-900">
              {formatDate(user.broker.lastSyncAt)}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
