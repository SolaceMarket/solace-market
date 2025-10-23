"use client";

import { SimpleTablesTab } from "../SimpleTablesTab";
import { QueryTab, type QueryTabRef } from "../QueryTab";
import { StatsTab } from "../StatsTab";
import { AdminTab } from "../AdminTab";
import { SettingsTab } from "../SettingsTab";
import type { DatabaseStats } from "../database-actions";

interface MainContentProps {
  activeTab: "tables" | "query" | "stats" | "admin" | "settings";
  tables: string[];
  stats: DatabaseStats | null;
  selectedTableFromCommand: string | null;
  selectedSettingsSection: string | null;
  queryTabRef: React.RefObject<QueryTabRef | null>;
  onTableCommandHandled: () => void;
  onTabChange: (tab: string) => void;
  onRefreshData: () => void;
  setSqlQuery: (query: string) => void;
  onSectionChange: () => void;
}

export function MainContent({
  activeTab,
  tables,
  stats,
  selectedTableFromCommand,
  selectedSettingsSection,
  queryTabRef,
  onTableCommandHandled,
  onTabChange,
  onRefreshData,
  setSqlQuery,
  onSectionChange,
}: MainContentProps) {
  return (
    <div className="flex-1 overflow-hidden h-full">
      {(() => {
        switch (activeTab) {
          case "tables":
            return (
              <SimpleTablesTab
                tables={tables}
                stats={stats}
                selectedTableFromCommand={selectedTableFromCommand}
                onTableCommandHandled={onTableCommandHandled}
              />
            );
          case "query":
            return <QueryTab ref={queryTabRef} onTabChange={onTabChange} />;
          case "stats":
            return <StatsTab stats={stats} />;
          case "admin":
            return (
              <AdminTab
                onRefreshData={onRefreshData}
                onTabChange={onTabChange}
                setSqlQuery={setSqlQuery}
              />
            );
          case "settings":
            return (
              <SettingsTab
                onTabChange={onTabChange}
                initialSection={selectedSettingsSection}
                onSectionChange={onSectionChange}
              />
            );
          default:
            return null;
        }
      })()}
    </div>
  );
}
