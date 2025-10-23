import { formatDate, copyToClipboard } from "../utils";
import type { AssetComponentProps } from "../types";

interface AssetSidebarProps extends AssetComponentProps {
  onRefresh: () => void;
}

export default function AssetSidebar({ asset, onRefresh }: AssetSidebarProps) {
  const parsedAttributes = asset.attributes
    ? JSON.parse(asset.attributes)
    : null;

  return (
    <div className="space-y-6">
      {/* Timestamps */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Timestamps</h2>
        <div className="space-y-4">
          <div>
            <div className="block text-sm font-medium text-gray-700">
              Created At
            </div>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(asset.createdAt)}
            </p>
          </div>
          <div>
            <div className="block text-sm font-medium text-gray-700">
              Last Updated
            </div>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(asset.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="space-y-3">
          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            onClick={() => {
              // TODO: Implement edit functionality
              alert("Edit functionality coming soon!");
            }}
          >
            Edit Asset
          </button>
          <button
            type="button"
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            onClick={onRefresh}
          >
            Refresh Data
          </button>
          <button
            type="button"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            onClick={() => {
              copyToClipboard(
                `${window.location.origin}/admin/assets/${asset.id}`,
                "Asset URL copied to clipboard!",
              );
            }}
          >
            Copy URL
          </button>
        </div>
      </div>

      {/* Additional Attributes */}
      {parsedAttributes && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Additional Attributes
          </h2>
          <div className="bg-gray-50 rounded-md p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(parsedAttributes, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
