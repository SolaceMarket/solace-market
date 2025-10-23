"use client";

import { useState, useTransition } from "react";
import { getTableInfo, getTableSample } from "./database-actions";
import type { TableInfo } from "./database-actions";
import type { SidebarMode } from "./tables";
import { CollapsibleSidebar, TableDetailsView } from "./tables";
import { useSettings } from "./settings";

interface TablesTabProps {
  tables: string[];
}

export function TablesTab({ tables }: TablesTabProps) {
  const { settings, updateSetting } = useSettings();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [sampleData, setSampleData] = useState<Record<string, unknown>[]>([]);
  const [isPending, startTransition] = useTransition();
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(
    settings.tables.sidebar.defaultMode,
  );
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);

  const loadTableDetails = (tableName: string) => {
    startTransition(async () => {
      try {
        const sampleLimit = settings.tables.sampleData.defaultLimit;
        const [info, sample] = await Promise.all([
          getTableInfo(tableName),
          getTableSample(tableName, sampleLimit),
        ]);
        setTableInfo(info);
        setSampleData(sample);
        setSelectedTable(tableName);

        // Auto-collapse sidebar when a table is selected
        if (sidebarMode === "auto-collapse") {
          setIsManuallyCollapsed(true);
        }
      } catch (error) {
        console.error("Error loading table details:", error);
      }
    });
  };

  const toggleSidebar = () => {
    if (sidebarMode === "manual-collapse") {
      setIsManuallyCollapsed(!isManuallyCollapsed);
    }
  };

  const changeSidebarMode = (mode: SidebarMode) => {
    setSidebarMode(mode);
    // Save the sidebar preference
    updateSetting({ path: "tables.sidebar.defaultMode", value: mode });
    if (mode === "always-open") {
      setIsManuallyCollapsed(false);
    }
  };

  const expandSidebar = () => {
    setIsManuallyCollapsed(false);
  };

  return (
    <div className="flex w-full">
      <CollapsibleSidebar
        tables={tables}
        selectedTable={selectedTable}
        isPending={isPending}
        sidebarMode={sidebarMode}
        isManuallyCollapsed={isManuallyCollapsed}
        onTableSelect={loadTableDetails}
        onSidebarModeChange={changeSidebarMode}
        onToggleSidebar={toggleSidebar}
        onExpandSidebar={expandSidebar}
      />
      <TableDetailsView
        selectedTable={selectedTable}
        tableInfo={tableInfo}
        sampleData={sampleData}
      />
    </div>
  );
}
