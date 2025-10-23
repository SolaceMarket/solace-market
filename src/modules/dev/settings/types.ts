export interface KeyboardShortcuts {
  toggle: string;
  close: string;
  executeQuery: string;
}

export interface ConsoleTheme {
  terminalMode: boolean;
  fontSize: "xs" | "sm" | "base" | "lg";
  fontFamily: "mono" | "sans" | "serif";
}

export interface ConsoleSettings {
  defaultTab: "tables" | "query" | "stats" | "admin";
  autoOpen: boolean;
  directCommandPalette: boolean;
  keyboardShortcuts: KeyboardShortcuts;
  theme: ConsoleTheme;
}

export interface SidebarSettings {
  defaultMode: "always-open" | "auto-collapse" | "manual-collapse";
  width: number;
  collapsedWidth: number;
}

export interface NavigationSettings {
  mode: "quickSwitch" | "verticalSidebar";
  verticalSidebarWidth: number;
}

export interface SampleDataSettings {
  defaultLimit: number;
  maxCellLength: number;
  truncateText: boolean;
}

export interface ColumnsSettings {
  showTypes: boolean;
  showConstraints: boolean;
  showDefaults: boolean;
}

export interface TablesSettings {
  sidebar: SidebarSettings;
  navigation: NavigationSettings;
  sampleData: SampleDataSettings;
  columns: ColumnsSettings;
}

export interface QueryEditorSettings {
  lineNumbers: boolean;
  wordWrap: boolean;
  autoComplete: boolean;
}

export interface QueryExecutionSettings {
  autoExecute: boolean;
  showExecutionTime: boolean;
  maxResults: number;
}

export interface QueryHistorySettings {
  enabled: boolean;
  maxEntries: number;
  persistAcrossSessions: boolean;
}

export interface QuerySettings {
  editor: QueryEditorSettings;
  execution: QueryExecutionSettings;
  history: QueryHistorySettings;
}

export interface StatsRefreshSettings {
  autoRefresh: boolean;
  interval: number;
}

export interface StatsDisplaySettings {
  showCharts: boolean;
  showTables: boolean;
  showIndexes: boolean;
}

export interface StatsSettings {
  refresh: StatsRefreshSettings;
  display: StatsDisplaySettings;
}

export interface AdminDangerousOperationsSettings {
  requireConfirmation: boolean;
  showWarnings: boolean;
}

export interface AdminBackupSettings {
  autoBackup: boolean;
  backupInterval: number;
}

export interface AdminSettings {
  dangerousOperations: AdminDangerousOperationsSettings;
  backup: AdminBackupSettings;
}

export interface DatabaseConsoleSettings {
  console: ConsoleSettings;
  tables: TablesSettings;
  query: QuerySettings;
  stats: StatsSettings;
  admin: AdminSettings;
}

export interface SettingsState {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  settings: DatabaseConsoleSettings;
}

export interface SettingsUpdate {
  path: string;
  value: unknown;
}
