"use client";

interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  count?: number;
  description?: string;
}

interface GenericSidebarProps {
  title: string;
  items: SidebarItem[];
  selectedItem: string | null;
  onItemSelect: (itemId: string) => void;
  width?: number;
  footer?: React.ReactNode;
  isLoading?: boolean;
  emptyState?: {
    icon: string;
    title: string;
    description: string;
  };
}

export function GenericSidebar({
  title,
  items,
  selectedItem,
  onItemSelect,
  width = 250,
  footer,
  isLoading = false,
  emptyState,
}: GenericSidebarProps) {
  return (
    <div
      className="bg-gray-800 border-r border-gray-700 overflow-y-auto flex-shrink-0 flex flex-col"
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="bg-gray-900 p-3 border-b border-gray-700 sticky top-0">
        <h3 className="font-semibold text-green-300 text-sm">{title}</h3>
      </div>

      {/* Items List */}
      <div className="flex-1 p-2">
        {items.length === 0 && emptyState ? (
          <div className="text-center py-8 px-4">
            <div className="text-3xl mb-2 opacity-50">{emptyState.icon}</div>
            <h4 className="text-sm font-semibold text-gray-400 mb-1">
              {emptyState.title}
            </h4>
            <p className="text-xs text-gray-500">{emptyState.description}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onItemSelect(item.id)}
                disabled={isLoading}
                className={`w-full text-left p-3 rounded transition-colors text-sm ${
                  selectedItem === item.id
                    ? "bg-green-600/20 border border-green-500/30 text-green-300"
                    : "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                title={item.description || `Select ${item.label}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.icon && (
                      <span className="text-xs opacity-75 flex-shrink-0">
                        {item.icon}
                      </span>
                    )}
                    <span className="truncate font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded-full text-gray-300 flex-shrink-0 ml-2">
                      {item.count}
                    </span>
                  )}
                </div>
                {selectedItem === item.id && item.description && (
                  <div className="text-xs text-green-400 mt-1 opacity-75">
                    {item.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div className="p-3 border-t border-gray-700 bg-gray-900/50">
          {footer}
        </div>
      )}
    </div>
  );
}