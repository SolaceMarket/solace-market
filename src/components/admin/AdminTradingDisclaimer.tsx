"use client";

export function AdminTradingDisclaimer() {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <span className="text-yellow-400 mr-3 text-lg">⚠️</span>
          <div className="text-sm text-yellow-700">
            <strong>Important Disclaimer:</strong>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>You are executing trades on behalf of other users</li>
              <li>
                Ensure you have proper authorization before placing any orders
              </li>
              <li>All trades are logged and auditable</li>
              <li>
                Market conditions and account balances may affect order
                execution
              </li>
              <li>
                This functionality should only be used by authorized
                administrators
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
