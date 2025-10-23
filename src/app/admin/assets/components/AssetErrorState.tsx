interface AssetErrorStateProps {
  error: string;
  title?: string;
  onBackClick: () => void;
  backButtonText?: string;
}

export default function AssetErrorState({
  error,
  title = "Asset Details",
  onBackClick,
  backButtonText = "← Back to Assets",
}: AssetErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            </div>
            <button
              type="button"
              onClick={onBackClick}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {backButtonText}
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
