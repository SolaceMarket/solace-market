"use client";

import type { AdminUserDetailProps } from "../types";
import { formatDate } from "../utils";

export default function OnboardingStatusCard({
  user,
  onUpdate,
  onEdit,
}: AdminUserDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Onboarding Status
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => onUpdate("resetOnboarding", {})}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => onEdit("onboarding")}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
        </div>
      </div>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm font-medium text-gray-500">Status</dt>
          <dd>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.onboarding.completed
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {user.onboarding.completed ? "Completed" : "In Progress"}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Current Step</dt>
          <dd className="text-sm text-gray-900">
            {user.onboarding.currentStep}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Completed Steps</dt>
          <dd className="text-sm text-gray-900">
            {user.onboarding.completedSteps.length > 0
              ? user.onboarding.completedSteps.join(", ")
              : "None"}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Last Activity</dt>
          <dd className="text-sm text-gray-900">
            {formatDate(user.onboarding.lastActivityAt)}
          </dd>
        </div>
        {user.onboarding.completedAt && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Completed At</dt>
            <dd className="text-sm text-gray-900">
              {formatDate(user.onboarding.completedAt)}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
