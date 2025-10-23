import type { AssetComponentProps } from "../types";

export default function AssetMarginInfo({ asset }: AssetComponentProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Margin Requirements
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="block text-sm font-medium text-gray-700">
            Maintenance Margin
          </div>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {asset.maintenanceMarginRequirement}%
          </p>
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700">
            Long Position Margin
          </div>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {asset.marginRequirementLong}%
          </p>
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700">
            Short Position Margin
          </div>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {asset.marginRequirementShort}%
          </p>
        </div>
      </div>
    </div>
  );
}
