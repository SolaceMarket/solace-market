import type { AssetComponentProps } from "../types";

export default function AssetBasicInfo({ asset }: AssetComponentProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Basic Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="block text-sm font-medium text-gray-700">
            Asset ID
          </div>
          <p className="mt-1 text-sm text-gray-900 font-mono">{asset.id}</p>
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700">Symbol</div>
          <p className="mt-1 text-lg font-bold text-gray-900">{asset.symbol}</p>
        </div>
        <div className="md:col-span-2">
          <div className="block text-sm font-medium text-gray-700">Name</div>
          <p className="mt-1 text-sm text-gray-900">{asset.name}</p>
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700">
            Asset Class
          </div>
          <p className="mt-1 text-sm text-gray-900">{asset.class}</p>
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700">
            Exchange
          </div>
          <p className="mt-1 text-sm text-gray-900">{asset.exchange}</p>
        </div>
      </div>
    </div>
  );
}
