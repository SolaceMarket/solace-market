"use client";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarHeader({ isCollapsed, onToggleCollapse }: SidebarHeaderProps) {
  return (
    <div className="bg-gray-900 border-b border-gray-700">
      <div className={`flex items-center justify-between ${isCollapsed ? 'p-1' : 'p-4'}`}>
        {!isCollapsed && (
          <h2 className="text-lg font-bold text-green-400">
            ⛁ Database Console
          </h2>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="bg-gray-600 hover:bg-gray-500 p-2 rounded text-sm transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>
    </div>
  );
}