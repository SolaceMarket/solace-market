import { useRouter } from "next/navigation";
import {
  getStatusBadgeSmall,
  getTradableBadge,
  formatDateShort,
} from "../utils";
import type { AssetsListProps } from "../types";

export default function AssetsTable({
  assets,
  pagination,
  onAssetClick,
  isLoading = false,
}: AssetsListProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Assets ({pagination.total})
          </h2>
          {isLoading && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Updating...</span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y divide-gray-200 ${isLoading ? "opacity-75" : ""}`}
        >
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Margin Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.map((asset) => (
              <tr
                key={asset.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onAssetClick(asset.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {asset.symbol}
                    </div>
                    <div className="text-sm text-gray-500">{asset.name}</div>
                    <div className="text-xs text-gray-400">{asset.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-900">{asset.class}</span>
                    <span className="text-xs text-gray-500">
                      {asset.exchange}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    {getStatusBadgeSmall(asset.status)}
                    {getTradableBadge(asset.tradable)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    {asset.marginable && (
                      <div className="text-xs">
                        📊 Long: {asset.marginRequirementLong}% | Short:{" "}
                        {asset.marginRequirementShort}%
                      </div>
                    )}
                    <div className="text-xs">
                      🔒 Maintenance: {asset.maintenanceMarginRequirement}%
                    </div>
                    {asset.shortable && (
                      <div className="text-xs">📉 Shortable</div>
                    )}
                    {asset.easyToBorrow && (
                      <div className="text-xs">💡 Easy to Borrow</div>
                    )}
                    {asset.fractionable && (
                      <div className="text-xs">🔢 Fractionable</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateShort(asset.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/assets/${asset.id}`);
                    }}
                    className="text-blue-600 hover:text-blue-900 hover:underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
