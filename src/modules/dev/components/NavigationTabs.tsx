"use client";

import { TabButton, type TabInfo } from "./TabButton";

interface NavigationTabsProps {
  tabs: TabInfo[];
  activeTab: string;
  isCollapsed: boolean;
  onTabChange: (tab: string) => void;
}

export function NavigationTabs({ tabs, activeTab, isCollapsed, onTabChange }: NavigationTabsProps) {
  return (
    <nav className="flex-1 overflow-y-auto">
      <div className={`space-y-2 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            isCollapsed={isCollapsed}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>
    </nav>
  );
}