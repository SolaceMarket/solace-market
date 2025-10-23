import type { TabInfo } from "../components/TabButton";

export function createTabsData(tablesCount: number): TabInfo[] {
  return [
    {
      id: "tables",
      label: "Tables",
      icon: "📋",
      description: "Browse database tables and schemas",
      badge: tablesCount,
    },
    {
      id: "query",
      label: "Query",
      icon: "💻",
      description: "Execute SQL queries and view results",
    },
    {
      id: "stats",
      label: "Statistics",
      icon: "📊",
      description: "Database metrics and performance data",
    },
    {
      id: "admin",
      label: "Administration",
      icon: "⚙️",
      description: "Database management and maintenance",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "🔧",
      description: "Console preferences and configuration",
    },
  ];
}