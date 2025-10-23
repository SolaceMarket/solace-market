"use client";

interface PreferencesEditFormProps {
  formData: Record<string, unknown>;
  setFormData: (data: Record<string, unknown>) => void;
}

export default function PreferencesEditForm({
  formData,
  setFormData,
}: PreferencesEditFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="theme"
          className="block text-sm font-medium text-gray-700"
        >
          Theme
        </label>
        <select
          id="theme"
          value={(formData.theme as string) || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              theme: e.target.value,
            })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select theme</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="defaultQuote"
          className="block text-sm font-medium text-gray-700"
        >
          Default Quote Currency
        </label>
        <select
          id="defaultQuote"
          value={(formData.defaultQuote as string) || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              defaultQuote: e.target.value,
            })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select default quote</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hints Enabled
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hintsEnabled"
            checked={(formData.hintsEnabled as boolean) || false}
            onChange={(e) =>
              setFormData({
                ...formData,
                hintsEnabled: e.target.checked,
              })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="hintsEnabled"
            className="ml-2 text-sm text-gray-700"
          >
            Enable UI hints and tooltips
          </label>
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notification Preferences
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="news"
              checked={(formData.news as boolean) || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  news: e.target.checked,
                })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="news"
              className="ml-2 text-sm text-gray-700"
            >
              News Updates
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="orderFills"
              checked={(formData.orderFills as boolean) || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  orderFills: e.target.checked,
                })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="orderFills"
              className="ml-2 text-sm text-gray-700"
            >
              Order Fills
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="riskAlerts"
              checked={(formData.riskAlerts as boolean) || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  riskAlerts: e.target.checked,
                })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="riskAlerts"
              className="ml-2 text-sm text-gray-700"
            >
              Risk Alerts
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="statements"
              checked={(formData.statements as boolean) || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  statements: e.target.checked,
                })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="statements"
              className="ml-2 text-sm text-gray-700"
            >
              Statements
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}