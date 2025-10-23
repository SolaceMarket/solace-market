export interface SettingsCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export const SETTINGS_CATEGORIES: SettingsCategory[] = [
  {
    id: "console",
    label: "Console",
    icon: "🖥️",
    description: "General console preferences",
  },
  {
    id: "tables",
    label: "Tables", 
    icon: "📋",
    description: "Table display and navigation",
  },
  {
    id: "query",
    label: "Query",
    icon: "💻", 
    description: "SQL editor and execution",
  },
  {
    id: "stats",
    label: "Statistics",
    icon: "📊",
    description: "Performance metrics display",
  },
  {
    id: "admin",
    label: "Administration", 
    icon: "⚙️",
    description: "Database management",
  },
];

export type SettingSectionType = "console" | "tables" | "query" | "stats" | "admin";