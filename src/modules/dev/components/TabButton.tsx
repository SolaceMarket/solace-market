"use client";

export interface TabInfo {
  id: "tables" | "query" | "stats" | "admin" | "settings";
  label: string;
  icon: string;
  description: string;
  badge?: string | number;
}

interface TabButtonProps {
  tab: TabInfo;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

function formatBadge(badge: string | number, isCollapsed: boolean, tabId: string): string {
  if (typeof badge === 'number') {
    if (isCollapsed && badge > 99) {
      return '99+';
    }
    if (!isCollapsed && tabId === 'stats') {
      return `${badge} tables`;
    }
  }
  return String(badge);
}

function TabBadge({ badge, isActive, isCollapsed, tabId }: { 
  badge: string | number; 
  isActive: boolean; 
  isCollapsed: boolean;
  tabId: string;
}) {
  const badgeClasses = isActive
    ? "bg-green-500/30 text-green-200"
    : "bg-gray-600 text-gray-300";

  const formattedBadge = formatBadge(badge, isCollapsed, tabId);

  if (isCollapsed) {
    return (
      <span className={`px-1 py-0.5 rounded text-xs font-medium leading-none ${badgeClasses}`}>
        {formattedBadge}
      </span>
    );
  }

  return (
    <div className="flex-shrink-0 ml-2">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClasses}`}>
        {formattedBadge}
      </span>
    </div>
  );
}

function CollapsedTabContent({ tab, isActive }: { tab: TabInfo; isActive: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5">
      <span className="text-base">{tab.icon}</span>
      {tab.badge && (
        <TabBadge 
          badge={tab.badge} 
          isActive={isActive} 
          isCollapsed={true}
          tabId={tab.id}
        />
      )}
    </div>
  );
}

function ExpandedTabContent({ tab, isActive }: { tab: TabInfo; isActive: boolean }) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <span className="text-lg flex-shrink-0">{tab.icon}</span>
        <div className="min-w-0">
          <div className="font-semibold text-sm">{tab.label}</div>
          <div className="text-xs opacity-75 mt-1 leading-relaxed">
            {tab.description}
          </div>
        </div>
      </div>
      {tab.badge && (
        <TabBadge 
          badge={tab.badge} 
          isActive={isActive} 
          isCollapsed={false}
          tabId={tab.id}
        />
      )}
    </div>
  );
}

export function TabButton({ tab, isActive, isCollapsed, onClick }: TabButtonProps) {
  const getButtonClasses = () => {
    const baseClasses = "w-full text-left transition-colors";
    
    if (isCollapsed) {
      const collapsedClasses = "p-1.5 rounded flex justify-center hover:bg-gray-700/50";
      const activeClasses = isActive 
        ? "bg-gray-700 text-green-300" 
        : "text-gray-300 hover:text-white";
      return `${baseClasses} ${collapsedClasses} ${activeClasses}`;
    }

    const expandedClasses = "p-3 rounded-lg";
    const activeClasses = isActive
      ? "bg-green-600/20 border border-green-500/30 text-green-300"
      : "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white";
    return `${baseClasses} ${expandedClasses} ${activeClasses}`;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={getButtonClasses()}
      title={isCollapsed ? tab.label : undefined}
    >
      {isCollapsed ? (
        <CollapsedTabContent tab={tab} isActive={isActive} />
      ) : (
        <ExpandedTabContent tab={tab} isActive={isActive} />
      )}
    </button>
  );
}