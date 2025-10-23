"use client";

import type { AdminUserDetailProps } from "../types";
import { formatDate } from "../utils";

export default function WalletInfoCard({
  user,
  onEdit,
}: Pick<AdminUserDetailProps, "user" | "onEdit">) {
  if (!user.wallet) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Wallet Information
        </h2>
        <button
          type="button"
          onClick={() => onEdit("wallet")}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Edit
        </button>
      </div>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm font-medium text-gray-500">Chain</dt>
          <dd className="text-sm text-gray-900">
            {user.wallet.chain.toUpperCase()}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Public Key</dt>
          <dd className="text-sm text-gray-900 font-mono break-all">
            {user.wallet.publicKey}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Verified At</dt>
          <dd className="text-sm text-gray-900">
            {formatDate(user.wallet.verifiedAt)}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Generated</dt>
          <dd className="text-sm text-gray-900">
            {user.wallet.isGenerated ? "Yes" : "No"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
