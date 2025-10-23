"use client";

import { useState } from "react";
import type { DatabaseStats } from "./database-actions";
import { useSettings } from "./settings";
import { SidebarHeader } from "./components/SidebarHeader";
import { NavigationTabs } from "./components/NavigationTabs";
import { DatabaseProfileFooter } from "./components/DatabaseProfileFooter";
import { createTabsData } from "./utils/tabsData";

interface SidebarNavigationProps {
  activeTab: "tables" | "query" | "stats" | "admin" | "settings";
  tables: string[];
  stats: DatabaseStats | null;
  onTabChange: (tab: string) => void;
}

export function SidebarNavigation({
  activeTab,
  tables,
  stats,
  onTabChange,
}: SidebarNavigationProps) {
  const { settings } = useSettings();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Get sidebar width from settings
  const sidebarWidth = isCollapsed 
    ? settings.tables.sidebar.collapsedWidth 
    : settings.tables.sidebar.width;

  // Calculate tab information with dynamic data
  const tabs = createTabsData(tables.length);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className="bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-200"
      style={{ width: `${sidebarWidth}px` }}
    >
      <SidebarHeader 
        isCollapsed={isCollapsed} 
        onToggleCollapse={handleToggleCollapse} 
      />
      
      <NavigationTabs 
        tabs={tabs}
        activeTab={activeTab}
        isCollapsed={isCollapsed}
        onTabChange={onTabChange}
      />
      
      <DatabaseProfileFooter 
        isCollapsed={isCollapsed}
        stats={stats}
      />
    </div>
  );
}
