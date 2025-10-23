// Types for the Tables tab components

export type SidebarMode = "always-open" | "auto-collapse" | "manual-collapse";

export interface SidebarState {
  mode: SidebarMode;
  isManuallyCollapsed: boolean;
  isCollapsed: boolean;
}

export interface TableSelectionState {
  selectedTable: string | null;
  isPending: boolean;
}
